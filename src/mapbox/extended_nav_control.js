export default class ExtendedControl {

  constructor() {
    this._container = document.createElement('div')
    this._zoomInButton = this._createButton('icon-plus map_control_group__button map_control_group__button__zoom', 'Zoom In', () => this._map.zoomIn())
    this._zoomOutButton = this._createButton('icon-minus map_control_group__button map_control_group__button__zoom', 'Zoom Out', () => this._map.zoomOut())
    this._compass = this._createButton('map_control_group__button map_control_group__button__compass', 'Reset North', () => {
      this._resetNorthAndTilt()
    })

    this._compassIndicator = this._createIcon('map_control__compass__icon')
    this._compass.appendChild(this._compassIndicator)

    this._center = this._createButton('icon-pin_geoloc map_control_group__button', 'Geolocate', () => {
      this._geolocate()
    })
  }

  onAdd(map) {
    this._map = map
    this._container.className = 'map_control_group'
    this._container.textContent = ''
    this._container.appendChild(this._compass)
    this._container.appendChild(this._center)
    this._container.appendChild(this._zoomInButton)
    this._container.appendChild(this._zoomOutButton)
    const _pitchAndRotateCompassArrow = this._pitchAndRotateCompassArrow.bind(this)

    _pitchAndRotateCompassArrow()

    this._map.on('rotate', _pitchAndRotateCompassArrow)
    this._map.on('pitch', _pitchAndRotateCompassArrow)

    return this._container
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container)
    this._map = undefined
  }

  _geolocate() {
    navigator.geolocation.getCurrentPosition((position) => {
      this._map.flyTo({center: [position.coords.longitude, position.coords.latitude]})
    })
  }

  _createButton(className, ariaLabel, fn) {
    const a = document.createElement('button')
    a.setAttribute('class', className)
    a.setAttribute('aria-label', ariaLabel)
    a.addEventListener('click', fn)
    this._container.appendChild(a)
    return a
  }

  _createIcon(className) {
    const a = document.createElement('span')
    a.setAttribute('class', className)
    return a
  }

  _resetNorthAndTilt() {
    this._map.easeTo({pitch: 0, bearing: 0})
  }

  _pitchAndRotateCompassArrow() {
    if(this._map.getPitch() === 0 && this._map.transform.angle === 0) {
      this._compass.style.display = 'none'
    } else {
      this._compass.style.display = 'block'
    }
    this._compassIndicator.style.transform = `scale(1, ${(1 - this._map.getPitch() / 110)}) rotate(${this._map.transform.angle * (180 / Math.PI)}deg)`
  }
}
