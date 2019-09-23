import ServicePanelView from '../views/service_panel.dot';
import Panel from '../libs/panel';
import nconf from '@qwant/nconf-getter';
import CategoryService from '../adapters/category_service';
import PanelResizer from '../libs/panel_resizer';
import Device from '../libs/device';

export default class ServicePanel {
  constructor() {
    this.panel = new Panel(this, ServicePanelView);
    if (Device.isMobile()) {
      this.panelResizer = new PanelResizer(this.panel);
    }
    this.isMobile = Device.isMobile();
    this.categories = CategoryService.getCategories();
    this.isDirectionActive = nconf.get().direction.enabled;
    this.active = true;
  }

  openFavorite() {
    window.app.navigateTo('/favs');
  }

  openDirection() {
    if (this.isDirectionActive) {
      window.app.navigateTo('/routes/');
    }
  }

  open() {
    this.active = true;
    this.panel.update();
    if (this.panelResizer) {
      window.execOnMapLoaded(() => {
        this.panelResizer.updateMapUiPosition();
      });
    }
  }

  close() {
    if (!this.active) {
      return;
    }
    this.active = false;
    this.panel.update();
  }

  openCategory(category) {
    window.app.navigateTo(`/places/?type=${category.name}`);
  }
}
