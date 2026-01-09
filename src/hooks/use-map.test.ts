import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMap } from './use-map';

// Мокаем Leaflet для тестирования - хук взаимодействует с DOM напрямую
vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({
      setView: vi.fn(),
      remove: vi.fn(),
      removeLayer: vi.fn(),
    })),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    marker: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
      bindPopup: vi.fn().mockReturnThis(),
    })),
    icon: vi.fn(options => options as unknown),
  },
}));

vi.mock('leaflet/dist/leaflet.css');

// Тестовые данные
const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Hotel One',
    type: 'hotel',
    price: 100,
    previewImage: 'hotel1.jpg',
    rating: 4.5,
    isPremium: true,
    isFavorite: false,
    city: {
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    reviews: [],
  },
];

const mockCenter: [number, number] = [48.8566, 2.3522];

describe('useMap hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return object with mapRef and map', () => {
    const { result } = renderHook(() =>
      useMap({ offers: [], activeOffer: null, center: mockCenter })
    );

    expect(result.current).toHaveProperty('mapRef');
    expect(result.current).toHaveProperty('map');
    expect(result.current.mapRef).toBeDefined();
    expect(result.current.map).toBeNull(); // карта инициализируется только при наличии DOM элемента
  });

  it('should accept correct props', () => {
    expect(() => {
      renderHook(() =>
        useMap({ offers: mockOffers, activeOffer: null, center: mockCenter })
      );
    }).not.toThrow();
  });

  // Note: Более сложные тесты взаимодействия с Leaflet/DOM
  // требуют эмуляции DOM элементов и детального мокирования
  // Эти тесты проверяют только базовую структуру возвращаемого объекта

  it('should accept empty offers array', () => {
    const { result } = renderHook(() =>
      useMap({ offers: [], activeOffer: null, center: mockCenter })
    );

    expect(result.current.mapRef).toBeDefined();
  });

  it('should accept active offer', () => {
    const { result } = renderHook(() =>
      useMap({
        offers: mockOffers,
        activeOffer: mockOffers[0],
        center: mockCenter,
      })
    );

    expect(result.current.mapRef).toBeDefined();
  });
});
