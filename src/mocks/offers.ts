export const offers: Offer[] = [
  {
    id: 1,
    title: 'Beautiful & luxurious apartment at great location',
    price: 120,
    ratingPercent: 80,
    isPremium: true,
    isBookmarked: false,
    city: 'Amsterdam',
    latitude: 52.3909553943508,
    longitude: 4.85309666406198,
    image: '/img/apartment-01.jpg',
    type: 'Apartment',
    reviews: [
      {
        id: 'review-1-1',
        user: {
          name: 'Max',
          avatar: '/img/avatar-max.jpg',
        },
        rating: 4,
        comment:
          'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
        date: '2019-04-24',
      },
    ],
  },
  {
    id: 2,
    title: 'Wood and stone place',
    price: 80,
    ratingPercent: 80,
    isPremium: false,
    isBookmarked: true,
    city: 'Amsterdam',
    latitude: 52.3609553943508,
    longitude: 4.85309666406198,
    image: '/img/room.jpg',
    type: 'Room',
    reviews: [
      {
        id: 'review-2-1',
        user: {
          name: 'Angelina',
          avatar: '/img/avatar-angelina.jpg',
        },
        rating: 5,
        comment:
          'An independent House, strategically located between Rembrand Square and National Opera, but where the bustle of the city comes to rest in this alley flowery and colorful.',
        date: '2019-05-15',
      },
    ],
  },
  {
    id: 3,
    title: 'Canal View Prinsengracht',
    price: 132,
    ratingPercent: 80,
    isPremium: false,
    isBookmarked: false,
    city: 'Amsterdam',
    latitude: 52.3909553943508,
    longitude: 4.929309666406198,
    image: '/img/apartment-02.jpg',
    type: 'Apartment',
    reviews: [],
  },
  {
    id: 4,
    title: 'Nice, cozy, warm big bed apartment',
    price: 180,
    ratingPercent: 100,
    isPremium: true,
    isBookmarked: false,
    city: 'Amsterdam',
    latitude: 52.3809553943508,
    longitude: 4.939309666406198,
    image: '/img/apartment-03.jpg',
    type: 'Apartment',
    reviews: [
      {
        id: 'review-4-1',
        user: {
          name: 'Max',
          avatar: '/img/avatar-max.jpg',
        },
        rating: 5,
        comment:
          'The apartment is perfect for a family vacation. Clean, comfortable and very spacious.',
        date: '2019-06-10',
      },
      {
        id: 'review-4-2',
        user: {
          name: 'Angelina',
          avatar: '/img/avatar-angelina.jpg',
        },
        rating: 4,
        comment:
          'Great location and beautiful view. The host was very helpful and responsive.',
        date: '2019-07-02',
      },
    ],
  },
];
