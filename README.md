# Angular BabylonJS Canvas Component: `BabylonjsCanvasComponent`

## Introduction:
* The `BabylonjsCanvasComponent` .aka. `<babylonjs-canvas>` is an [Angular Component](https://angular.io/api/core/Component) 
that wraps a HTML Canvas element that is bound to the browser's [WebGL](https://www.khronos.org/webgl/wiki/Main_Page) context. 
The resultant browser WebGL context is managed through the [BabylonJS](https://www.babylonjs.com/) 3D graphics API.

* This component handles the infrastructure of creating and managing the `BABYLON.Engine` and `BABYLON.Scene`, 
BabylonJS's render loop, BabylonJS's key bindings, and BabylonJS's resizing events.    

* `BabylonjsCanvasComponent` was not designed to be used directly: 
It was designed to be encapsulated in another Angular component that provides a "render function". 
The render function is the function passed to the `BABYLON.scene.registerBeforeRender(function() {})` 
BabylonJS registration function.
---
## Disambiguation:
*Animation*: When the term 'animation' is used here it refers to 
[BabylonJS's Complex Animation](https://doc.babylonjs.com/babylon101/animations#complex-animation) capabilities.
BabylonJS also has simple built in animation capability .aka. `BABYLON.AnimationEvent`... 
These are _not_ the animations being discussed here.

---
## BabylonjsCanvasComponent General Usage: 

1.) Embed the `<babylonjs-canvas>` component selector in _your_ component's template HTML.

2.) Use Angular's `ViewChild` to get a reference to the canvas component element and type it as `BabylonjsCanvasComponent`.

*!!! IMPORTANT: Use { static: true } as the ViewChild second parameter. !!! .e.g:*

```@ViewChild('explodedcubecanvas', {static: true}) private bjsCanvasComponent: BabylonjsCanvasComponent;```

3.) In the `NgInit()` function of your component create the WebGL context by using the
`BabylonjsCanvasComponent.createAnimation()` function. The `createAnimation()` function first initializes
the `BABYLON.Engine` and `BABYLON.Scene` and then invokes a callback function _you_ supply that returns
the actual BabylonJS render function having  aTypeScript signature: `() => void`.

After _your_ function returns the render function it is registered with BabylonJS render loop.

When calling `BabylonjsCanvasComponent.createAnimation()` default camera, light, and axis functions 
are supplied if none are specified.

4.) Create frame-by-frame animations inside your render function using the `BABYLON.Scene` parameter passed
to the rendering function creation callback which should capture the `BABYLON.Scene` parameter!

## Cavaets:

 a.) It was necessary to have the explicit initialization function BabylonjsCanvasComponent.createAnimation()
because the embedded BabylonjsCanvasComponent is created before your encapsulating component is created causing
chicken/egg issues.

 b.) Only one canvas per page is currently supported: Experiments with multiple BabylonjsCanvasComponent embedded
into one parent component's HTML caused issues with the binding of the WASD view manipulation keys .aka.
they ceased working. This might be overcome by using the "BabylonJS Observables" but that was
out of scope for my effort.

---
## Angular Component Selector for `BabylonjsCanvasComponent`:

`<babylonjs-canvas>`

---
## API:

### `BabylonjsCanvasComponent.createAnimation(sceneFunc, cameraFunc, lightFunc, axisFunc)`

```
createAnimation(sceneFunc: (bjsCanvasComponent: BabylonjsCanvasComponent, scene: BABYLON.Scene) => () => void,
                  cameraFunc: (canvas: HTMLCanvasElement, scene: BABYLON.Scene) => BABYLON.Camera = BabylonjsCanvasComponent.defaultFlyCamera,
                  lightFunc: (scene: BABYLON.Scene) => BABYLON.Light = BabylonjsCanvasComponent.defaultHemisphericalLight,
                  axisFunc: (scene: BABYLON.Scene) => void = BabylonjsCanvasComponent.defaultAxis
  ): void
```

* *Note: Required Parameter `sceneFunc` is a reference to a function that returns the "render function", _not_ a reference to the render function itself.* 
Why? Because the render function has the signature: `() => void` meaning that it cannot be passed parameters. `sceneFunc` can get around this
 restriction by returning a render function that closes on the input parameter(s) to the render function instead of passing the parameters.
* Optional Parameters `cameraFunc`, `lightFunc`, and `axisFunc` are optional as simple defaults are supplied.

---
## Auto-Generated Docs:

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.19.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
