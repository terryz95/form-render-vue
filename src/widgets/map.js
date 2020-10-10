import { Modal, Drawer } from 'ant-design-vue'
import Map from '../components/map'
import { isObj } from '../base/utils'
export default {
  inheritAttrs: false,
  data() {
    return {
      show: false,
    }
  },
  computed: {
    options() {
      return this.$attrs.options || {}
    },
    schema() {
      return this.$attrs.schema
    },
  },
  methods: {
    toggle() {
      this.show = !this.show
    },
  },
  render() {
    if (this.options && this.options.modal) {
      const config = isObj(this.options.modal) ? this.options.modal : {}
      const { text } = config
      return (
        <div>
          <a class="pointer" onClick={this.toggle}>
            {text && typeof text === 'string' ? '+ ' + text : '+ 配置'}
          </a>
          <Modal
            title={(this.schema && this.schema.title) || '子配置'}
            visible={this.show}
            onCancel={this.toggle}
            footer={null}
            width="80%"
            {...{ props: config }}
            style={{ maxWidth: 800, ...config.style }}
          >
            <Map {...{ props: this.$attrs }} />
          </Modal>
        </div>
      )
    }
    if (this.options && this.options.drawer) {
      const config = isObj(this.options.drawer) ? this.options.drawer : {}
      const { text } = config
      return (
        <div>
          <a class="pointer" onClick={this.toggle}>
            {text && typeof text === 'string' ? '+ ' + text : '+ 配置'}
          </a>
          <Drawer
            title={(this.schema && this.schema.title) || '子配置'}
            visible={this.show}
            onClose={this.toggle}
            width="80%"
            {...{ props: config }}
          >
            <Map {...{ props: this.$attrs }} />
          </Drawer>
        </div>
      )
    }
    return <Map {...{ props: this.$attrs }} />
  },
}
