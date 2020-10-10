import debounce from 'lodash.debounce'
import { asField, DefaultFieldUI } from '../base/asField'
import { isDeepEqual } from '../base/utils'
import resolve from '../base/resolve'
import { getValidateList } from '../base/validate'
import RenderField from './renderField'
import '../styles/atom.css'
import '../styles/index.css'

export default {
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: '$form',
    },
    column: {
      type: Number,
      default: 1,
    },
    className: String,
    schema: {
      type: Object,
      default: () => {},
    },
    formData: {
      type: Object,
      default: () => {},
    },
    widgets: {
      type: Object,
      default: () => {},
    },
    fieldUi: {
      type: Object,
      default: DefaultFieldUI,
    },
    fields: {
      type: Object,
      default: () => {},
    },
    mapping: {
      type: Object,
      default: () => {},
    },
    showDescIcon: {
      type: Boolean,
      default: false,
    },
    showValidate: {
      type: Boolean,
      default: true,
    },
    displayType: {
      type: String,
      default: 'column',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    labelWidth: {
      type: Number,
      default: 110,
    },
    useLogger: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isUserInput: false,
      originWidgets: null,
      generatedFields: {},
    }
  },
  computed: {
    data() {
      return resolve(this.schema, this.formData)
    },
    settings() {
      return {
        schema: this.schema,
        data: this.data,
        name: this.name,
        column: this.column,
        showDescIcon: this.showDescIcon,
        showValidate: this.showValidate,
        displayType: this.displayType,
        readOnly: this.readOnly,
        labelWidth: this.labelWidth,
        useLogger: this.useLogger,
        formData: this.data,
      }
    },
  },
  watch: {
    schema: {
      deep: true,
      immediate: true,
      handler: this.schemaWatcher,
    },
    formData: {
      deep: true,
      immediate: true,
      handler: this.formDataWatcher,
    },
  },
  mounted() {
    if (this.$listeners.mount) {
      this.$emit('mount', this.data)
    } else {
      this.$emit('change', this.data)
    }
    this.updateValidation()
  },
  methods: {
    updateValidation() {
      this.$emit('validate', getValidateList(this.data, this.schema))
    },
    debouncedValidate(msg) {
      let vm = this
      debounce(() => vm.$emit('validate', msg), 500)
    },
    handleChange(key, val) {
      this.isUserInput = true
      this.$emit('change', val)
      this.debouncedValidate(getValidateList(val, this.schema))
    },
    resetIsUserInput() {
      if (this.isUserInput) {
        this.isUserInput = false
        return true
      }
      return false
    },
    schemaWatcher(val, prev) {
      if (this.resetIsUserInput()) {
        return
      }
      if (!isDeepEqual(prev, val)) {
        this.$emit('change', this.data)
        this.updateValidation()
      }
    },
    formDataWatcher(val, prev) {
      if (this.resetIsUserInput()) {
        return
      }
      if (!isDeepEqual(prev, val)) {
        this.updateValidation()
      }
    },
  },
  render() {
    const generated = {}
    if (!this.originWidgets) {
      this.originWidgets = this.widgets
    }
    Object.keys(this.widgets).forEach(key => {
      const oWidget = this.originWidgets[key]
      const nWidget = this.widgets[key]
      let gField = this.generatedFields[key]
      if (!gField || oWidget !== nWidget) {
        if (oWidget !== nWidget) {
          this.originWidgets[key] = nWidget
        }
        gField = asField({ FieldUI: this.fieldUi, Widget: nWidget })
        this.generatedFields[key] = gField
      }
      generated[key] = gField
    })
    const _fields = {
      // 根据 Widget 生成的 Field
      generated,
      // 自定义的 Field
      customized: this.fields,
      // 字段 type 与 widgetName 的映射关系
      mapping: this.mapping,
    }
    return (
      <div class={`${this.className} fr-wrapper`}>
        <RenderField
          {...{ props: this.settings }}
          fields={_fields}
          onChange={this.handleChange}
        />
      </div>
    )
  },
}
