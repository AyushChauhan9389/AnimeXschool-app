# LeleKart

**Edge to Edge layout is enabled.**

## Android Performance Optimization
Add the following to `android/app/build.gradle` to disable compression of the bundle file. This will reduce the app opening time.

```gradle
androidResources {
    noCompress += ['bundle']
}
```