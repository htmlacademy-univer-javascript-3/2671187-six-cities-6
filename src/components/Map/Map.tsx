import { useMap } from './useMap';

type MapProps = {
  offers: Offer[];
  activeOffer?: Offer | null;
  center: [number, number];
  height?: string;
};

function Map({
  offers,
  activeOffer = null,
  center,
  height = '100%',
}: MapProps): JSX.Element {
  const { mapRef } = useMap({ offers, activeOffer, center });

  return <div ref={mapRef} style={{ height }}></div>;
}

export default Map;
