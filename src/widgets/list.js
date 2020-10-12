import { Button, Modal, Drawer } from 'ant-design-vue'
import listHoc from '../components/listHoc'
import { isObj } from '../base/utils'

const FrButton = {
  functional: true,
  render(h, ctx) {
    const { icon, ...rest } = ctx.props
    const children = ctx.children
    return (
      <Button {...{ props: rest }} size="small" icon={icon}>
        {children}
      </Button>
    )
  },
}

const List = listHoc(FrButton)

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
    arrLength() {
      return (this.$attrs.value && this.$attrs.value.length) || 0
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
          <a class="pointer" onClick={this.toggle.bind(this)}>
            {text && typeof text === 'string' ? '+ ' + text : '+ 配置'}
          </a>
          <Modal
            title={(this.schema && this.schema.title) || '子配置'}
            visible={this.show}
            onCancel={this.toggle.bind(this)}
            footer={null}
            width="80%"
            {...{ props: config }}
            style={{ maxWidth: 800, ...config.style }}
          >
            <div class="fr-wrapper">
              <List {...{ attrs: this.$attrs }} />
            </div>
          </Modal>
        </div>
      )
    }
    if (this.options && this.options.drawer) {
      const config = isObj(this.options.drawer) ? this.options.drawer : {}
      const { text } = config
      return (
        <div>
          <a class="pointer" onClick={this.toggle.bind(this)}>
            {text && typeof text === 'string' ? '+ ' + text : '+ 配置'}
          </a>
          <Drawer
            title={(this.schema && this.schema.title) || '子配置'}
            visible={this.show}
            onClose={this.toggle.bind(this)}
            width="80%"
            {...{ props: config }}
          >
            <div class="fr-wrapper">
              <List {...{ attrs: this.$attrs }} />
            </div>
          </Drawer>
        </div>
      )
    }
    return <List {...{ attrs: this.$attrs }} />
  },
}
