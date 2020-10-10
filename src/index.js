import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import FormRender from './formRender'
import { mapping as originMapping, widgets as originWidgets } from './widgets'
export default {
  inheritAttrs: false,
  props: {
    mapping: {
      type: Object,
      default: () => {},
    },
    widgets: {
      type: Object,
      default: () => {},
    },
    configProvider: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    [ConfigProvider.name]: ConfigProvider,
  },
  render() {
    return (
      <a-config-provider {...{ props: this.configProvider }} locale={zhCN}>
        <FormRender
          {...{ props: this.$attrs }}
          mapping={{
            ...originMapping,
            ...this.mapping,
          }}
          widgets={{
            ...originWidgets,
            ...this.widgets,
          }}
        />
      </a-config-provider>
    )
  },
}
