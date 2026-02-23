const API_URL = "https://fortnite-api.com/v2/shop/br?language=es";

export const getFortniteShop = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    // Retornamos todas las secciones de la tienda (Daily, Featured, etc.)
    return data.data; 
  } catch (error) {
    console.error("Error cargando la tienda:", error);
    return null;
  }
};