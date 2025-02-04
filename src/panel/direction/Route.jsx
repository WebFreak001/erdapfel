import React from 'react';
import RouteSummary from './RouteSummary';
import RoadMap from './RoadMap';

const Route = ({
  id, route, vehicle, showDetails, origin, destination, isActive,
  openDetails, openPreview, selectRoute, hoverRoute,
}) =>
  <div className={`itinerary_leg ${isActive ? 'itinerary_leg--active' : ''}`}
    onMouseEnter={() => { hoverRoute(id, true); }}
    onMouseLeave={() => { hoverRoute(id, false); }}
  >
    <RouteSummary id={id} route={route}
      openDetails={openDetails}
      openPreview={openPreview}
      selectRoute={selectRoute}
      vehicle={vehicle}
    />
    {showDetails && <RoadMap
      route={route}
      origin={origin}
      destination={destination}
      vehicle={vehicle} />}
  </div>;

export default Route;
