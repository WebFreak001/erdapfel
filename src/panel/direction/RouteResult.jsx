/* globals _, fire, listen */
import React from 'react';
import PropTypes from 'prop-types';
import Route from './Route';
import { getVehicleIcon, getAllSteps } from 'src/libs/route_utils';
import MobileRoadMapPreview from './MobileRoadMapPreview';

export default class RouteResult extends React.Component {
  static propTypes = {
    routes: PropTypes.array,
    origin: PropTypes.string,
    destination: PropTypes.string,
    vehicle: PropTypes.string,
    isLoading: PropTypes.bool,
    error: PropTypes.bool,
    previewRoute: PropTypes.object,
    openMobilePreview: PropTypes.func.isRequired,
  }

  static defaultProps = {
    routes: [],
  }

  state = {
    activeRouteId: 0,
    activeDetails: false,
  }

  componentDidMount() {
    listen('select_road_map', routeId => {
      this.selectRoute(routeId);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.routes.length !== prevProps.routes.length) {
      this.setState({ activeRouteId: 0 });
    }
  }

  selectRoute = routeId => {
    if (routeId === this.state.activeRouteId) {
      return;
    }
    fire('toggle_route', routeId);
    this.setState({ activeRouteId: routeId });
  }

  hoverRoute = (routeId, highlightMapRoute) => {
    if (routeId === this.state.activeRouteId) {
      return;
    }
    fire('toggle_route', highlightMapRoute ? routeId : this.state.activeRouteId);
  }

  openRouteDetails = routeId => {
    if (this.state.activeRouteId === routeId) {
      this.setState(prevState => ({ activeDetails: !prevState.activeDetails }));
    } else {
      fire('toggle_route', routeId);
      this.setState({
        activeRouteId: routeId,
        activeDetails: true,
      });
    }
  }

  openPreview = routeId => {
    this.props.openMobilePreview(this.props.routes[routeId]);
  }

  render() {
    if (this.props.error) {
      return <div className="itinerary_no-result">
        <span className="icon-alert-triangle" />
        <div>{_('Qwant Maps found no results for this itinerary.')}</div>
      </div>;
    }

    if (this.props.isLoading) {
      return <div className="itinerary_result">
        <div className="itinerary_leg itinerary_leg--placeholder">
          <div className="itinerary_leg_summary">
            <div className={`itinerary_leg_icon ${getVehicleIcon(this.props.vehicle)}`} />
            <div className="itinerary_leg_via">
              <div className="itinerary_placeholder-box" style={{ width: '133px' }} />
              <div className="itinerary_placeholder-box" style={{ width: '165px' }} />
              <div className="itinerary_placeholder-box" style={{ width: '70px' }} />
            </div>
            <div className="itinerary_leg_info">
              <div className="itinerary_leg_duration">
                <div className="itinerary_placeholder-box" style={{ width: '47px' }} />
              </div>
              <div className="itinerary_leg_distance">
                <div className="itinerary_placeholder-box" style={{ width: '59px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>;
    }

    if (this.props.previewRoute) {
      return <MobileRoadMapPreview steps={getAllSteps(this.props.previewRoute)} />;
    }

    return <div className="itinerary_result">
      {this.props.routes.map((route, index) => <Route
        key={index}
        id={index}
        route={route}
        origin={this.props.origin}
        destination={this.props.destination}
        vehicle={this.props.vehicle}
        isActive={this.state.activeRouteId === index}
        showDetails={this.state.activeRouteId === index && this.state.activeDetails}
        openDetails={this.openRouteDetails}
        openPreview={this.openPreview}
        selectRoute={this.selectRoute}
        hoverRoute={this.hoverRoute}
      />)}
    </div>;
  }
}
