/**
 * Maps an Offer to FavoriteOffer format for favorites list
 */
export function mapOfferToFavorite(offer: Offer): FavoriteOffer {
  return {
    id: offer.id.toString(),
    title: offer.title,
    type: offer.type,
    price: offer.price,
    image: offer.previewImage, // map previewImage to image
    ratingPercent: offer.rating * 20, // convert rating (0-5) to percentage (0-100)
    isPremium: offer.isPremium,
    city: offer.city.name, // extract city name
  };
}
