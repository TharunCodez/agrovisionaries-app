// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true })); // allow secured origins in production
app.use(express.json({ limit: '1mb' }));

// Helper: Decoder based on the TTN V2-compatible logic you provided
function decodePayloadBytes(bytes: number[]): any {
  if (!bytes || bytes.length < 6) {
    return { error: 'payload too short' };
  }
  const ginger_percent = bytes[0];
  const cherry_percent = bytes[1];

  let tempRaw = bytes[2];
  let temperature_c = null;
  if (tempRaw !== 0x80) {
    if (tempRaw > 127) tempRaw = tempRaw - 256;
    temperature_c = tempRaw / 2.0;
  }

  const battery_raw = (bytes[3] === 255) ? null : bytes[3];

  const flags = bytes[4] & 0xFF;
  const rain = (flags & 0x01) !== 0;
  const ginger_valve = (flags & 0x02) !== 0;
  const cherry_valve = (flags & 0x04) !== 0;
  const pump = (flags & 0x08) !== 0;

  const water_raw = bytes[5];
  const water_level_percent = (water_raw === 255) ? null : water_raw;

  return {
    ginger_percent,
    cherry_percent,
    temperature_c,
    battery_raw,
    rain,
    rain_num: rain ? 1 : 0,
    ginger_valve,
    ginger_valve_num: ginger_valve ? 1 : 0,
    cherry_valve,
    cherry_valve_num: cherry_valve ? 1 : 0,
    pump,
    pump_num: pump ? 1 : 0,
    flags_raw: flags,
    water_level_percent
  };
}

// Normalize TTN uplink to Firestore doc
function makeDeviceObjectFromUplink(body: any) {
  // body.data.uplink_message.decoded_payload (if TTN decoded it), or decode frm_payload (base64)
  const up = body.data?.uplink_message;
  const endDevice = body.data?.end_device_ids ?? body.identifiers?.[0]?.device_ids;
  const device_id = endDevice?.device_id ?? (up?.end_device_ids?.device_id);

  // prefer decoded payload if provided; otherwise decode frm_payload base64
  let decoded = up?.decoded_payload ?? null;
  if (!decoded && up?.frm_payload) {
    try {
      // convert base64 string to bytes
      const bytes = Buffer.from(up.frm_payload, 'base64');
      const arr = Array.from(bytes).map(b => b & 0xff);
      decoded = decodePayloadBytes(arr);
    } catch (err) {
      decoded = { error: 'failed to decode frm_payload', detail: String(err) };
    }
  }

  // rx metadata (choose first)
  const rxMeta = up?.rx_metadata?.[0] ?? null;
  const rssi = rxMeta?.rssi ?? null;
  const snr = rxMeta?.snr ?? null;
  const gateway_id = rxMeta?.gateway_ids?.gateway_id ?? null;

  // timestamps: ensure plain ISO strings
  const received_at = body.data?.received_at ?? up?.received_at ?? new Date().toISOString();
  const createdAtISO = new Date(received_at).toISOString();

  // Decide mapping for your UI fields:
  // - temperature: decoded.temperature_c
  // - soilMoisture: decide to map ginger_percent or cherry_percent (choose one). We'll store both.
  // - waterLevel: decoded.water_level_percent
  // - battery: decoded.battery_raw
  // - rssi: rssi
  // - pump/valves: decoded.pump / decoded.cherry_valve / decoded.ginger_valve

  const deviceObj: any = {
    id: device_id ?? 'unknown',
    lastReceivedAt: createdAtISO,
    source: 'ttn',
    decoded_payload: decoded,
    temperature: decoded?.temperature_c ?? null,
    gingerPercent: decoded?.ginger_percent ?? null,
    cherryPercent: decoded?.cherry_percent ?? null,
    soilMoisture: decoded?.cherry_percent ?? decoded?.ginger_percent ?? null, // pick as needed
    battery: decoded?.battery_raw ?? null,
    waterLevelPercent: decoded?.water_level_percent ?? null,
    pump: decoded?.pump ?? false,
    gingerValve: decoded?.ginger_valve ?? false,
    cherryValve: decoded?.cherry_valve ?? false,
    flagsRaw: decoded?.flags_raw ?? null,
    rssi,
    snr,
    gateway_id,
    raw_body: body
  };

  return deviceObj;
}

// TTN Webhook endpoint - POST
app.post('/ttnWebhook', async (req, res) => {
  try {
    // Validate method & basic secret header
    // Optional: secure with a shared secret header (TTN allows setting headers)
    const authorization = req.headers['authorization'] || req.headers['Authorization'];
    // If you set TTN to attach a key header value, verify it:
    // if (!authorization || authorization !== `Bearer ${process.env.TTN_API_KEY}`) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    const body = req.body;
    if (!body?.data) {
      console.warn('Webhook received invalid body', body);
      return res.status(400).json({ error: 'Invalid TTN body' });
    }

    const deviceObj = makeDeviceObjectFromUplink(body);

    // Write to Firestore devices collection (plain objects only)
    // Use a single doc per device: devices/{device_id}
    const deviceId = deviceObj.id || `unknown-${Date.now()}`;
    const devicesColl = process.env.FIRESTORE_DEVICES_COLLECTION || 'devices';
    const deviceDocRef = db.collection(devicesColl).doc(deviceId);

    // Save two things:
    // 1) update device "latest" summary (merge)
    // 2) push a history record to devices/{deviceId}/uplinks collection

    const latestData = {
      id: deviceId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(), // server side; clients must convert when reading
      lastReceivedAtISO: deviceObj.lastReceivedAt, // an ISO string (plain)
      temperature: deviceObj.temperature,
      soilMoisture: deviceObj.soilMoisture,
      battery: deviceObj.battery,
      waterLevelPercent: deviceObj.waterLevelPercent,
      pump: deviceObj.pump,
      rssi: deviceObj.rssi,
      snr: deviceObj.snr,
      gateway_id: deviceObj.gateway_id,
      raw: deviceObj.decoded_payload ? deviceObj.decoded_payload : null,
      source: deviceObj.source
    };

    await deviceDocRef.set(latestData, { merge: true });

    // add history record (normalize timestamp to plain ISO for clients)
    const history = {
      receivedAtISO: deviceObj.lastReceivedAt,
      createdAtISO: new Date().toISOString(),
      decoded: deviceObj.decoded_payload,
      temperature: deviceObj.temperature,
      soilMoisture: deviceObj.soilMoisture,
      battery: deviceObj.battery,
      waterLevelPercent: deviceObj.waterLevelPercent,
      pump: deviceObj.pump,
      rssi: deviceObj.rssi,
      snr: deviceObj.snr
    };
    await deviceDocRef.collection('uplinks').add(history);

    console.log('Processed uplink for', deviceId);
    return res.status(200).json({ ok: true, deviceId });
  } catch (err) {
    console.error('ttnWebhook error:', err);
    return res.status(500).json({ error: 'internal' });
  }
});

// Optional: helper to send downlink to TTN via HTTP API (requires TTN API Key)
async function sendDownlinkToTtn(deviceId: string, f_port: number, bin_payload: string) {
  // TTN V3 /api/v3/as/applications/<app-id>/devices/<device-id>/down/push
  const apiKey = process.env.TTN_API_KEY;
  if (!apiKey) throw new Error('TTN_API_KEY not configured');

  const appId = process.env.TTN_APPLICATION_ID;
  const url = `https://eu1.cloud.thethings.network/api/v3/as/applications/${appId}/devices/${deviceId}/down/push`;

  const body = {
    downlink: {
      f_port,
      priority: 'NORMAL',
      frm_payload: bin_payload // base64-encoded payload
    }
  };

  const resp = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  return resp.data;
}

// Expose sendDownlink as an HTTP POST for testing
app.post('/downlink/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { f_port = 1, frm_payload } = req.body;
    if (!frm_payload) return res.status(400).json({ error: 'frm_payload required (base64)' });
    const result = await sendDownlinkToTtn(deviceId, f_port, frm_payload);
    return res.status(200).json({ ok: true, result });
  } catch (e) {
    console.error('downlink error', e);
    return res.status(500).json({ error: String(e) });
  }
});

// wrap express app as firebase function
export const ttnWebhook = functions.https.onRequest(app);
