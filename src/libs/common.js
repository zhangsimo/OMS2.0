import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

export function setScrollBar(id) {
  return new PerfectScrollbar('#'+id, {
    useBothWheelAxes: true
  })
}
