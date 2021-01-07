import Vue from 'vue'
import {
  Button,
  Image,
  Dialog,
  Cell,
  CellGroup,
  Field,
  Popup,
  Icon,
  Toast,
  List,
  DropdownMenu,
  DropdownItem,
  Notify,
  Steps,
  Step,
  Uploader,
  Row,
  Col,
  Form,
  NavBar,
  Tab,
  Tabs
} from 'vant'
Vue.use(Button)
  .use(Image)
  .use(Dialog)
  .use(Cell)
  .use(CellGroup)
  .use(Field)
  .use(Popup)
  .use(Icon)
  .use(Toast)
  .use(List)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Notify)
  .use(Steps)
  .use(Step)
  .use(Uploader)
  .use(Row)
  .use(Col)
  .use(Form)
  .use(NavBar)
  .use(Tab)
  .use(Tabs)
// ======================================
Vue.prototype.$Notify = Notify
Toast.setDefaultOptions({position: 'bottom'})
