export type ShippingItem = {
  weightKg: number;
  heightCm: number;
  widthCm: number;
  lengthCm: number;
  quantity: number;
};

export type ShippingQuote = {
  carrierName: string;
  serviceName: string;
  price: number;
  estimatedDays: number;
};

type FrenetServiceResult = {
  Carrier: string;
  ServiceDescription: string;
  ShippingPrice: string;
  DeliveryTime: number;
  Error: boolean;
  Msg?: string;
};

const FRENET_QUOTE_URL = "https://api.frenet.com.br/shipping/quote";

export async function quoteShipping(recipientCep: string, items: ShippingItem[]): Promise<ShippingQuote[]> {
  const token = process.env.FRENET_TOKEN;
  const sellerCep = process.env.FRENET_SELLER_CEP;

  if (!token || !sellerCep) {
    return mockQuote(recipientCep);
  }

  const cleanRecipientCep = recipientCep.replace(/\D/g, "");
  const cleanSellerCep = sellerCep.replace(/\D/g, "");

  const invoiceValue = 0;
  const response = await fetch(FRENET_QUOTE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify({
      SellerCEP: cleanSellerCep,
      RecipientCEP: cleanRecipientCep,
      ShipmentInvoiceValue: invoiceValue,
      ShippingItemArray: items.map((item) => ({
        Height: item.heightCm,
        Length: item.lengthCm,
        Width: item.widthCm,
        Weight: item.weightKg,
        Quantity: item.quantity,
      })),
      RecipientCountry: "BR",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Frenet respondeu com status ${response.status}`);
  }

  const data = (await response.json()) as { ShippingSevicesArray: FrenetServiceResult[] };

  return data.ShippingSevicesArray.filter((service) => !service.Error).map((service) => ({
    carrierName: service.Carrier,
    serviceName: service.ServiceDescription,
    price: Number(service.ShippingPrice.replace(",", ".")),
    estimatedDays: service.DeliveryTime,
  }));
}

function mockQuote(recipientCep: string): ShippingQuote[] {
  const cleanCep = recipientCep.replace(/\D/g, "");
  if (cleanCep.length !== 8) return [];

  return [
    { carrierName: "Transportadora Parceira (simulado)", serviceName: "Econômico", price: 89.9, estimatedDays: 7 },
    { carrierName: "Transportadora Parceira (simulado)", serviceName: "Expresso", price: 149.9, estimatedDays: 3 },
  ];
}
