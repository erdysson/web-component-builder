[![codecov](https://codecov.io/gh/erdysson/web-component-builder/branch/master/graph/badge.svg?token=8V9TKX3RZJ)](https://codecov.io/gh/erdysson/web-component-builder)
![example workflow](https://github.com/erdysson/web-component-builder/actions/workflows/main.yml/badge.svg?branch=release&event=push)
[![NPM](https://nodei.co/npm/web-component-builder.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/web-component-builder/)

### Web Component Builder

`web-component-builder` is a simple typescript project that allows creating web components with an angular-like syntax.

Currently, capabilities are :

* **`Component`** declarations with `selector` and inline `template`


* **`Component`** **`inputs`** as custom element **`attributes`**


* **`Component`** lifecycle methods like **`onInit`**, **`onChanges`**, **`onViewInit`** and **`onDestroy`**


* **`Dependency Injection`** through **`services / providers`**

### Examples

`
@Component({
    selector: 'my-comp',
    template: '<div>My First Web Component with Builder!</div>'
})
class MyComp implements IOnInit, IOnDestroy() {
}
`
