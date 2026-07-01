import { NextResponse } from 'next/server';

const MOCK_TRACKING_DATA = {
  "VR777888999IN": {
    trackingNumber: "VR777888999IN",
    status: "Delivered",
    currentLocation: "New York, USA",
    estimatedDelivery: "Delivered",
    receiver: "John Miller",
    weight: "2.5 kg",
    dimensions: "30 x 20 x 15 cm",
    shipmentType: "Express Delivery",
    origin: "Ahmedabad, India",
    destination: "New York, USA",
    bookedDate: "2026-06-20",
    expectedDelivery: "2026-06-24",
    coordinates: {
      current: [40.7128, -74.0060], // NYC
      destination: [40.7128, -74.0060],
      origin: [23.0225, 72.5714] // AMD
    },
    history: [
      { date: "2026-06-24", time: "14:35", location: "New York, USA", status: "Delivered", remarks: "Shipment delivered. Signature captured." },
      { date: "2026-06-24", time: "09:15", location: "New York, USA", status: "Out For Delivery", remarks: "Out for delivery with local courier." },
      { date: "2026-06-23", time: "18:40", location: "New York Hub, USA", status: "Custom Clearance", remarks: "Customs cleared. Released for last-mile transit." },
      { date: "2026-06-22", time: "11:20", location: "New York JFK Airport, USA", status: "Airport Landing", remarks: "Flight arrived. Unloaded and sent to customs." },
      { date: "2026-06-21", time: "22:10", location: "Ahmedabad Airport, India", status: "Flight Dispatch", remarks: "Departed on cargo flight AI-101." },
      { date: "2026-06-21", time: "08:30", location: "Ahmedabad Warehouse, India", status: "Warehouse Sorting", remarks: "Sorted and prepared for customs clearance." },
      { date: "2026-06-20", time: "15:45", location: "Ahmedabad Hub, India", status: "Picked Up", remarks: "Shipment picked up by courier executive." },
      { date: "2026-06-20", time: "10:00", location: "Ahmedabad Office, India", status: "Booked", remarks: "Shipment booked and label generated." }
    ]
  },
  "VR111222333IN": {
    trackingNumber: "VR111222333IN",
    status: "Airport",
    currentLocation: "London Heathrow Airport, UK",
    estimatedDelivery: "2026-07-02",
    receiver: "David Smith",
    weight: "12.0 kg",
    dimensions: "50 x 40 x 30 cm",
    shipmentType: "Air Cargo",
    origin: "Ahmedabad, India",
    destination: "London, UK",
    bookedDate: "2026-06-27",
    expectedDelivery: "2026-07-02",
    coordinates: {
      current: [51.4700, -0.4543], // Heathrow
      destination: [51.5074, -0.1278], // London
      origin: [23.0225, 72.5714] // AMD
    },
    history: [
      { date: "2026-06-29", time: "16:10", location: "London Heathrow Airport, UK", status: "Airport Landing", remarks: "Cargo flight arrived. Unloaded and queued for customs." },
      { date: "2026-06-28", time: "23:55", location: "Ahmedabad Airport, India", status: "Flight Dispatch", remarks: "Departed on cargo flight BA-122." },
      { date: "2026-06-28", time: "14:20", location: "Ahmedabad Warehouse, India", status: "Warehouse Sorting", remarks: "Consolidated into air cargo container." },
      { date: "2026-06-27", time: "17:30", location: "Ahmedabad Hub, India", status: "Picked Up", remarks: "Parcel picked up from customer premises." },
      { date: "2026-06-27", time: "12:15", location: "Ahmedabad Office, India", status: "Booked", remarks: "Shipment booked and scheduled for express pickup." }
    ]
  },
  "VR555666777IN": {
    trackingNumber: "VR555666777IN",
    status: "Out For Delivery",
    currentLocation: "Dubai Marina, UAE",
    estimatedDelivery: "Today, By 6:00 PM",
    receiver: "Fatima Al Maktoum",
    weight: "0.8 kg",
    dimensions: "22 x 15 x 5 cm",
    shipmentType: "Document Courier",
    origin: "Ahmedabad, India",
    destination: "Dubai, UAE",
    bookedDate: "2026-06-26",
    expectedDelivery: "2026-06-29",
    coordinates: {
      current: [25.0782, 55.1416], // Dubai Marina
      destination: [25.2048, 55.2708], // Dubai
      origin: [23.0225, 72.5714]
    },
    history: [
      { date: "2026-06-29", time: "08:15", location: "Dubai Marina, UAE", status: "Out For Delivery", remarks: "Out for delivery with express agent." },
      { date: "2026-06-28", time: "21:40", location: "Dubai Customs Hub, UAE", status: "Custom Clearance", remarks: "Import custom cleared and transit approved." },
      { date: "2026-06-28", time: "09:30", location: "Dubai Airport, UAE", status: "Airport Landing", remarks: "Flight EK-501 landed at DXB airport." },
      { date: "2026-06-27", time: "21:05", location: "Ahmedabad Airport, India", status: "Flight Dispatch", remarks: "Departed on cargo flight." },
      { date: "2026-06-27", time: "10:10", location: "Ahmedabad Warehouse, India", status: "Warehouse Sorting", remarks: "Sorted by destination country zone." },
      { date: "2026-06-26", time: "16:20", location: "Ahmedabad Hub, India", status: "Picked Up", remarks: "Document pickup completed." },
      { date: "2026-06-26", time: "11:00", location: "Ahmedabad Office, India", status: "Booked", remarks: "Priority document booking registered." }
    ]
  }
};

export async function GET(request, { params }) {
  const trackingId = (await params).id;
  
  if (!trackingId) {
    return NextResponse.json({ error: "Tracking number is required" }, { status: 400 });
  }

  // Support uppercase and lowercase
  const trackingNumberUpper = trackingId.toUpperCase();
  const mockData = MOCK_TRACKING_DATA[trackingNumberUpper];

  if (mockData) {
    return NextResponse.json(mockData);
  }

  // Let's generate a dynamic "In Transit" package for any code matching a prefix like 'VR' and ending in 'IN'
  if (trackingNumberUpper.startsWith('VR') && trackingNumberUpper.endsWith('IN') && trackingNumberUpper.length >= 10) {
    const dynamicData = {
      trackingNumber: trackingNumberUpper,
      status: "Warehouse",
      currentLocation: "Ahmedabad Warehouse, India",
      estimatedDelivery: "2026-07-05",
      receiver: "Global Client",
      weight: "5.0 kg",
      dimensions: "40 x 30 x 20 cm",
      shipmentType: "International Courier",
      origin: "Ahmedabad, India",
      destination: "Global Destination",
      bookedDate: "2026-06-28",
      expectedDelivery: "2026-07-05",
      coordinates: {
        current: [23.0753, 72.5222], // AMD Warehouse
        destination: [37.7749, -122.4194], // San Francisco (Default global)
        origin: [23.0225, 72.5714]
      },
      history: [
        { date: "2026-06-29", time: "09:30", location: "Ahmedabad Warehouse, India", status: "Warehouse Sorting", remarks: "Undergoing export packaging and documentation." },
        { date: "2026-06-28", time: "16:45", location: "Ahmedabad Hub, India", status: "Picked Up", remarks: "Shipment collected from Ahmedabad shipper location." },
        { date: "2026-06-28", time: "14:00", location: "Ahmedabad Office, India", status: "Booked", remarks: "Booking registered online." }
      ]
    };
    return NextResponse.json(dynamicData);
  }

  return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
}
