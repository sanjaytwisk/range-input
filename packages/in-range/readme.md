# In Range

Accessible range input component in vanilla JavaScript

## Installation

```sh
npm install @twisk/in-range
# or
yarn add @twisk/in-range
```

## Usage

This library exposes two components: rangeValue and rangeMinMax. Both components are tightly coupled to a HTML structure using a set of data attributes and BEM classnames. Both components follow progressive enhancement principles and can be used without CSS and JavaScript.

### CSS

Both components depend on CSS to work properly. Before you start using either of the components, please include [css/in-range.css](./css/in-range.css). If your are using an asset bundler like webpack you can also include the css in your bundle:

```js
import '@twisk/in-range/css/in-range.css'
```

#### Variables

The appearance of the components can be changed using classname overrides, or using a set of CSS custom properties. These properties should be applied on the root element (`.in-range-value`|`.in-range-minmax`) or on one of its parent elements.

```css
:.in-range-value {
  --range-thumb-size: 1rem;
  --range-thumb-color: black;
  --range-thumb-color-focus: black;
  --range-thumb-color-active: grey;
  --range-thumb-radius: 1rem;
  --range-track-height: 2px;
  --range-track-color: grey;
  --range-focus-color: grey; /* the color of the focus outline */
  --range-focus-size: 2px; /* the width of the focus outline */
  --range-focus-offset: 0px; /* the space between the thumb and the focus outline */
  --range-fill-color: grey;
}
```

### JavaScript

#### Options

These options apply to both the rangeValue and rangeMinMax component

**`selector`**: `string | HTMLElement`
a string containing a valid element selector or a valid html element object

**`min`** (optional): `number`
override the min value

**`max`** (optional): `number`
override the max value

**`step`** (optional): `number`
override the step value

**`onValidate`** (optional): `(value: number) => boolean`
custom method to validate the range value before it is updated

**`onValueChange`** (optional): `(event: { target: { name, value }}) => void`
callback that is called each time the range value is updated.

#### rangeValue(options, initialValue)

The rangeValue component can be used to create a range input that sets a single value within a given range.

```html
<div
  data-in-range="value"
  data-in-range-name="range-value"
  data-in-range-min="0"
  data-in-range-max="10"
  data-in-range-step="1"
  class="in-range-value"
>
  <div class="in-range-track"></div>
  <div class="in-range-fill" data-in-range-fill=""></div>
  <input
    type="range"
    min="0"
    max="10"
    step="1"
    class="in-range-value__input"
    id="range-value"
    name="range-value"
    data-in-range-input=""
    value="0"
  />
  <label
    data-in-range-thumb=""
    class="in-range-value__label"
    htmlFor="range-value"
    draggable="false"
  >
    Set amount
  </label>
</div>
```

```js
import { rangeValue } from '@twisk/in-range'

/* prevent the value to be set back to the min value */
const onValidate = (value) => value !== 4

/* do something when the value changes */
const onValueChange = ({ target }) => {
  doSomethingWithValue(target.value)
}

/* set the initialvalue */
const initialValue = 4

const rangeValueInstance = rangeValue(
  {
    selector: '[data-in-range="value"]',
    min: 4,
    max: 16,
    step: 4,
    onValidate,
    onValueChange,
  },
  initialValue
)
```

#### rangeMinMax(options, initialValue)

The rangeMinMax component can be used to create a range input that sets a min and max value within a given range by composing two rangeValue components.

```html
<fieldset
  class="in-range-minmax"
  data-in-range="minmax"
  data-in-range-name="range-minmax"
  data-in-range-min="0"
  data-in-range-max="10"
  data-in-range-step="1"
>
  <div class="in-range-track"></div>
  <div class="in-range-fill" data-range-fill=""></div>
  <div data-in-range-name="min" class="in-range-value">
    <input
      type="range"
      min="0"
      max="10"
      step="1"
      class="in-range-value__input"
      id="range-minmax[min]"
      name="range-minmax[min]"
      data-in-range-input=""
      value="0"
    />
    <label
      data-in-range-thumb=""
      class="in-range-value__label"
      htmlFor="range-minmax[min]"
      draggable="false"
    >
      Set minimum amount
    </label>
  </div>
  <div data-in-range-name="max" class="in-range-value">
    <input
      type="range"
      min="0"
      max="10"
      step="1"
      class="in-range-value__input"
      id="range-minmax[max]"
      name="range-minmax[max]"
      data-in-range-input=""
      value="10"
    />
    <label
      data-in-range-thumb=""
      class="in-range-value__label"
      htmlFor="range-minmax[max]"
      draggable="false"
    >
      Set maximum amount
    </label>
  </div>
</fieldset>
```

```js
import { rangeMinMax } from '@twisk/in-range'

/* do something when the value changes */
const onValueChange = ({ target }) => {
  doSomethingWithValue(target.value.min, target.value.max)
}

/* set the initialvalue */
const initialValue = { min: 4, max: 8 }

const rangeValueInstance = rangeValue(
  {
    selector: '[data-in-range="value"]',
    min: 0,
    max: 20,
    step: 2,
    onValueChange,
  },
  initialValue
),
```

### Data attributes explained

**data attributes root element**

- `data-in-range="value|minmax"` where `value|minmax` indicates this is a rangeValue or rangeMinMax component
- `data-in-range-name="<name>"` where `<name>` is the name of the input field
- `data-in-range-min="0"` where `0` sets the minimum value of the range
- `data-in-range-max="10` where `10` sets the maximum value of the range
- `data-in-range-step="1"` where `1` sets the increment of the range value

**data attributes nested elements**

- `data-in-range-thumb` should be applied to a label element and will be draggable
- `data-in-range-input` should be applied to an input element
- `data-in-range-fill` (optional) should be applied to a div and renders a bar between the min value and the thumb
