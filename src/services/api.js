import axios from 'axios';

// API Client configuration
const apiClient = axios.create({
  baseURL: typeof window !== 'undefined' ? '' : 'http://localhost:3000', // Adjust for SSR
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper for retrying API requests
const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 1.5);
  }
};

export const apiService = {
  /**
   * Fetch shipment tracking details
   * @param {string} trackingNumber 
   */
  getTrackingDetails: async (trackingNumber) => {
    const formattedNum = trackingNumber.trim().toUpperCase();
    return retryRequest(async () => {
      try {
        const response = await apiClient.get(`/api/tracking/${formattedNum}`);
        return { data: response.data, error: null };
      } catch (error) {
        return { 
          data: null, 
          error: error.response?.data?.error || "Unable to find shipment with this tracking number." 
        };
      }
    });
  },

  /**
   * Submit multi-step shipping inquiry
   * @param {object} inquiryData 
   */
  submitInquiry: async (inquiryData) => {
    return retryRequest(async () => {
      try {
        const response = await apiClient.post('/api/inquiry', inquiryData);
        return { data: response.data, error: null };
      } catch (error) {
        return { 
          data: null, 
          error: error.response?.data?.error || "Something went wrong. Please try again later." 
        };
      }
    });
  },

  /**
   * Calculate local price estimate based on zone and weight
   * @param {string} destinationCountry 
   * @param {number} weight 
   * @param {string} parcelType 
   */
  calculateEstimatePricing: (destinationCountry, weight, parcelType) => {
    // Basic billing estimation algorithm
    // In production, this can call a GET /api/pricing endpoint
    const parsedWeight = parseFloat(weight) || 0.5;
    
    // Base rates per kg based on general zones
    let baseRate = 800; // default (Asia/GCC)
    let transitDays = "3-5 Business Days";

    const US_CANADA = ["United States", "Canada", "US", "CA"];
    const UK_EUROPE = ["United Kingdom", "Germany", "France", "Netherlands", "GB", "DE", "FR", "NL"];
    const GCC = ["United Arab Emirates", "Saudi Arabia", "UAE", "AE", "SA"];
    const OCEANIA = ["Australia", "New Zealand", "AU", "NZ"];

    if (US_CANADA.includes(destinationCountry)) {
      baseRate = 1200;
      transitDays = "3-4 Business Days";
    } else if (UK_EUROPE.includes(destinationCountry)) {
      baseRate = 1100;
      transitDays = "4-5 Business Days";
    } else if (GCC.includes(destinationCountry)) {
      baseRate = 750;
      transitDays = "2-3 Business Days";
    } else if (OCEANIA.includes(destinationCountry)) {
      baseRate = 1350;
      transitDays = "5-6 Business Days";
    }

    if (parcelType === "document") {
      baseRate = baseRate * 0.7; // Documents are lighter/cheaper
    } else if (parcelType === "medicine") {
      baseRate = baseRate * 1.25; // Cold-chain/priority handling
    } else if (parcelType === "cargo") {
      baseRate = baseRate * 0.9; // Bulk rate discount
    }

    const freightCharges = Math.round(baseRate * parsedWeight);
    const fuelSurcharge = Math.round(freightCharges * 0.18); // 18% fuel tax
    const documentationFee = parcelType === "document" ? 150 : 450;
    const cgst = Math.round((freightCharges + fuelSurcharge + documentationFee) * 0.09);
    const sgst = Math.round((freightCharges + fuelSurcharge + documentationFee) * 0.09);
    const totalAmount = freightCharges + fuelSurcharge + documentationFee + cgst + sgst;

    return {
      freightCharges,
      fuelSurcharge,
      documentationFee,
      tax: cgst + sgst,
      totalAmount,
      transitDays
    };
  }
};
