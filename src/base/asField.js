import { getValidateText } from './validate'
import { isHidden, isDependShow } from './isHidden'
import {
  isLooselyNumber,
  isCssLength,
  convertValue,
  isDeepEqual,
} from './utils'

export const asField = ({ FieldUI, Widget }) => {
  const FieldContainer = {
    inheritAttrs: false,
    props: {
      className: String,
      column: {
        type: Number,
        default: 1,
      },
      showValidate: {
        type: Boolean,
        default: true,
      },
      isRoot: {
        type: Boolean,
        default: false,
      },
      hidden: [Boolean, String, Function],
      props: {
        type: Object,
        default: () => {},
      },
      showDescIcon: {
        type: Boolean,
        default: false,
      },
      width: [String, Number],
      labelWidth: [String, Number],
      disabled: [Boolean, String, Function],
      readonly: [Boolean, String, Function],
      options: [Object, String, Function],
      schema: [Object, String, Function],
      displayType: {
        type: String,
        default: 'column',
      },
      rootValue: {
        type: Object,
        default: () => {},
      },
      formData: {
        type: Object,
        default: () => {},
      },
      dependShow: [Boolean, String, Function],
      value: [Object, String, Number, Boolean, Array],
    },
    data() {
      return {
        firstRender: true,
        fieldTouched: false,
      }
    },
    computed: {
      _hidden() {
        return convertValue(this.hidden, this.formData, this.rootValue)
      },
      _disabled() {
        return convertValue(this.disabled, this.formData, this.rootValue)
      },
      _readonly() {
        return convertValue(this.readonly, this.formData, this.rootValue)
      },
      _options() {
        let map = Object.create(null)
        try {
          Object.entries(this.options).forEach(([key, _val]) => {
            map[key] = convertValue(_val, this.formData, this.rootValue)
          })
        } catch (e) {
          // throw error
        }
        return map
      },
      _schema() {
        // iterate over schema, and convert every key
        let map = Object.create(null)
        Object.keys(this.schema).forEach(key => {
          const availableKey = [
            'title',
            'description',
            'format',
            'minimum',
            'maximum',
            'minLength',
            'maxLength',
            'pattern',
            'message',
            'min',
            'max',
            'step',
            'enum',
            'enumNames',
          ]
          // TODO: need to cover more
          if (availableKey.indexOf(key) > -1) {
            map[key] = convertValue(
              this.schema[key],
              this.formData,
              this.rootValue
            )
          }
        })
        return map
      },
      // 传入组件的值
      _rest() {
        return {
          ...this.$attrs,
          schema: this._schema,
          disabled: this._disabled,
          readonly: this._readonly,
          options: this._options,
          formData: this.formData || {},
          rootValue: this.rootValue || {},
        }
      },
      validateText() {
        return this.showValidate || this.fieldTouched
          ? getValidateText(this._rest)
          : ''
      },
      // 必填*，label，描述，竖排时的校验语，只要存在一个，label就不为空
      showLabel() {
        return (
          this._schema.title ||
          this.$attrs.description ||
          this.$attrs.required ||
          (this.displayType !== 'row' && this.validateText)
        )
      },
      isModal() {
        return this.options && (this.options.modal || this.options.drawer)
      },
    },
    watch: {
      value: {
        deep: true,
        immediate: true,
        handler: function(val, prev) {
          if (this.showValidate) return
          // 首次渲染不做, TODO: 万一首次渲染是用户输入触发的呢？
          if (this.firstRender) {
            this.firstRender = false
            return
          }
          // 已经动过了就不用验证是否动过
          if (this.fieldTouched) return
          // 之后每次改动就算touch了，尽量避免多余的去使用isDeepEqual，大的复杂表单性能会不好
          if (isDeepEqual(prev, val)) return
          this.fieldTouched = true
        },
      },
    },
    render() {
      // "ui:hidden": true, hide formItem
      // after "convertValue" being stable, this api will be discarded
      if (
        this._hidden &&
        isHidden({
          hidden: this._hidden,
          rootValue: this.rootValue,
          formData: this.formData,
        })
      ) {
        return null
      }
      // 历史方法，不建议使用ui:dependShow, 一律使用ui:hidden
      if (
        isDependShow({ formData: this.formData, dependShow: this.dependShow })
      ) {
        return null
      }

      let isComplex =
        this._schema.type === 'object' ||
        (this._schema.type === 'array' && this._schema.enum === undefined)
      if (this.isModal) {
        isComplex = false
      }

      let columnStyle = {}
      if (!isComplex && this.width) {
        columnStyle = {
          width: this.width,
          paddingRight: '12px',
        }
      } else if (!isComplex && this.column > 1) {
        columnStyle = {
          width: `calc(100% /${this.column})`,
          paddingRight: '12px',
        }
      }

      const fieldProps = {
        className: this.className,
        columnStyle,
        displayType: this.displayType,
        isComplex,
        isRequired: this.$attrs.required,
        isRoot: this.isRoot,
        schema: this._schema,
        showDescIcon: this.showDescIcon,
        showLabel: this.showLabel,
        showValidate: this.showValidate,
        validateText: this.validateText,
        labelWidth: this.labelWidth,
      }
      return (
        <FieldUI {...{ props: fieldProps }}>
          <Widget {...{ props: this._rest }} invalid={this.validateText} />
        </FieldUI>
      )
    },
  }
  return FieldContainer
}

export const DefaultFieldUI = {
  functional: true,
  render(h, ctx) {
    const {
      className,
      columnStyle, // 处理组件宽度，外部一般不需修改
      displayType, // 展示方式：row 横 column 竖
      isComplex, // 是否是复杂结构：对象和对象数组
      isRequired, // 是否是必填项
      isRoot,
      schema,
      showDescIcon,
      showLabel, // 是否展示label
      // showValidate, // 是否展示校验
      validateText, // 校验文字
      labelWidth, // label的长度
    } = ctx.props
    const children = ctx.children
    const {
      title,
      type,
      enum: _enum,
      description = '',
      'ui:widget': widget,
      'ui:options': options,
    } = schema
    const isCheckbox = type === 'boolean' && widget !== 'switch'
    const isModal = options && (options.modal || options.drawer)
    let fieldClass = `fr-field w-100 ${isComplex ? 'fr-field-complex' : ''}`
    let labelClass = 'fr-label mb2'
    let contentClass = 'fr-content'
    switch (type) {
      case 'object':
        if (isModal) {
          break
        }
        if (title) {
          labelClass += ' fr-label-object bb b--black-20 pb1 mt2 mb3' // fr-label-object 无默认style，只是占位用于使用者样式覆盖
        }
        if (!isRoot) {
          fieldClass += ' fr-field-object' // object的margin bottom由内部元素撑起
          if (title) {
            contentClass += ' ml3' // 缩进
          }
        }
        break
      case 'array':
        if (isModal) {
          break
        }
        if (title && !_enum) {
          labelClass += ' fr-label-array mt2 mb3'
        }
        break
      case 'boolean':
        if (isCheckbox) {
          if (title) {
            labelClass += ' ml2'
            labelClass = labelClass.replace('mb2', 'mb0')
          }
          contentClass += ' flex items-center' // checkbox高度短，需要居中对齐
          fieldClass += ' flex items-center flex-row-reverse justify-end'
        }
        break
      default:
        if (displayType === 'row') {
          labelClass = labelClass.replace('mb2', 'mb0')
        }
    }
    // 横排时
    if (displayType === 'row' && !isComplex && !isCheckbox) {
      fieldClass += ' flex items-center'
      labelClass += ' flex-shrink-0 fr-label-row'
      labelClass = labelClass.replace('mb2', 'mb0')
      contentClass += ' flex-grow-1 relative'
    }

    // 横排的checkbox
    if (displayType === 'row' && isCheckbox) {
      contentClass += ' flex justify-end pr2'
    }

    const _labelWidth = isLooselyNumber(labelWidth)
      ? Number(labelWidth)
      : isCssLength(labelWidth)
      ? labelWidth
      : 110 // 默认是 110px 的长度
    let labelStyle = { width: _labelWidth }
    if (isCheckbox) {
      labelStyle = { flexGrow: 1 }
    } else if (isComplex || displayType === 'column') {
      labelStyle = { flexGrow: 1 }
    }

    return (
      <div
        class={className ? `${className} ${fieldClass}` : fieldClass}
        style={columnStyle}
      >
        {showLabel && (
          <div class={labelClass} style={labelStyle}>
            <label
              class={`fr-label-title ${
                isCheckbox || displayType === 'column' ? 'no-colon' : ''
              }`} // boolean不带冒号
              title={title}
            >
              {isRequired && <span class="fr-label-required"> *</span>}
              <span
                class={`${isComplex ? 'b' : ''} ${
                  displayType === 'column' ? 'flex-none' : ''
                }`}
              >
                {title}
              </span>
              {description &&
                (showDescIcon ? (
                  <span class="fr-tooltip-toggle" aria-label={description}>
                    <i class="fr-tooltip-icon" />
                    <div class="fr-tooltip-container">
                      <i class="fr-tooltip-triangle" />
                      {description}
                    </div>
                  </span>
                ) : (
                  <span class="fr-desc ml2">(&nbsp;{description}&nbsp;)</span>
                ))}
              {displayType !== 'row' && validateText && (
                <span class="fr-validate">{validateText}</span>
              )}
            </label>
          </div>
        )}
        <div
          class={contentClass}
          style={
            isCheckbox
              ? displayType === 'row'
                ? { marginLeft: _labelWidth }
                : {}
              : { flexGrow: 1 }
          }
        >
          <div class={`flex ${isComplex ? 'flex-column' : 'items-center'}`}>
            {children}
          </div>
          <span
            class={`fr-validate fr-validate-row ${
              isComplex ? 'relative' : 'absolute'
            }`}
          >
            {displayType === 'row' && validateText ? validateText : ''}
          </span>
        </div>
      </div>
    )
  },
}
