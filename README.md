# grunt-veronica

> һ�� grunt ��������ڹ��� veronica �����Ŀ

## ����

�ò����Ҫ Grunt `~0.4.5`

�����ûʹ�ù� [Grunt](http://gruntjs.com/) , ����� Grunt [����ָ��](http://gruntjs.com/getting-started) ��
�˽���δ���һ�� [Gruntfile](http://gruntjs.com/sample-gruntfile)���Լ�������װ��ʹ�� Grunt �����

�������Ĺ����������ͨ���������װ��������

```shell
npm install grunt-veronica --save-dev
```

��װ��Ϻ������ Gruntfile �ļ���������� JavaScript ���룺

```js
grunt.loadNpmTasks('grunt-veronica');
```

## "veronica" ����

### ����

�� Gruntfile ��, ���һ�� `veronica` ���ݶ��󣬴��뵽 `grunt.initConfig()` �

```js
grunt.initConfig({
  veronica: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### ������

#### appDir

���ͣ�`String` Ĭ��ֵ��`''`

Ӧ�ó����·��

#### baseUrl

���ͣ�`String` Ĭ��ֵ��`''`

Ӧ�ó����·���������ļ���main.js ���ڵ����·��

#### dir

���ͣ�`String` Ĭ��ֵ��`''`

������Ӧ�ó����·��

#### reqConfig

���ͣ�`Object` Ĭ��ֵ��`''`

���� RequireJS �������������

* paths: ���������·��
* shim: 
* packages: ��������İ�·��

#### modules

���ͣ�`Array` Ĭ��ֵ��`[]`

Ӧ���е�ģ�飬����ģ���·������ source + name ��϶��ɣ�Ĭ�ϻ���Ҹ�ģ��·���µ� `widgets` �� `plugins` �ļ��У�Ҳ����˵Ĭ������£���Ӧ�ý������Ͳ���ŵ����λ�ã������ŵ������ļ����£���Ӧ������ subpaths�����磺 

```
[{
   name: 'base',  // ģ������
   source: './modules'  // ģ����õ�·������·�������Ӧ�õĻ�·����,
   subpaths: ['widgets/widgets1']  // �����Ĭ��·���»�������·�����ò�������������������
}]
```

����ģ��Ŀ¼Ϊ�� ./modules/base������������ ./modules/base/widgets/widgets1 �У�������÷�ӳ��һ����ʵ������������ĳ����֪·�������ļ����У�Ҳ���ᱻʶ�����������˲��������� ./modules/base/widgets �У������ŵ� ./modules/base/widgets/widgets1 ���򲻻ᱻʶ����Ӧ��Ϊ���·����������һ�� `subpaths`

> **ע��**
>
> �����Ŀû�� module����ô���ʱ���� name Ϊ '.'����Ϊÿ������Դ���� subpaths
> ```js
> modules: [{
    name: '.',
    source: '.',
    subpaths: ['./widgets/base']
> }]
> ```

#### optimize

���ͣ�`String` Ĭ��ֵ��`'none'`

������Ż�������none �� uglify��Ĭ���� none

#### solution

���ͣ�`String` Ĭ��ֵ��`''`

�������·����û�е����Ľ�������ļ��ɲ���

#### merge

���ͣ�`Array` Ĭ��ֵ��`[]`

Ҫ�ϲ������ļ���·��

ʾ����

```
merge: ['veronica-mvc', 'app']
```

#### notMerge

���ͣ�`Array` Ĭ��ֵ��`[]`

���ļ�������ų���·�������ϲ��������ļ���

#### moduleMerge

���ͣ�`Array` Ĭ��ֵ��`[]`

��� module �е� widget �� plugin ʱ��Ҫ�ϲ��ĵ������⡣

Ĭ�ϲ���ϲ�������module�е��κε������⣬��������ÿ���ĳЩֻ��һ���ط����ֵĵ�������ϲ���widget��plugin�����ļ���

#### clean

���ͣ�`Array` Ĭ��ֵ��`[]`

�ϲ���������ļ����У�

#### buildPaths

���ͣ�`Object` Ĭ��ֵ��`{}`

���ʱ���õĲ�ͬ��·��

#### cssPack

���ͣ�`String` Ĭ��ֵ��`'all'`

css����Ĳ��ԣ�������ֻ֧�ֽ����� modules �� css �ļ��ϲ���һ���ļ���

> **ע��**
>
> ���� IE6 - IE9 CSS��ʽ�����ƣ�����ڴ��Ӧ���ǵ�����ʽ�ļ���������ʽѡ��������֮���ҵ�ƽ���ϵ��
�ο���http://stackoverflow.com/questions/9906794/internet-explorers-css-rules-limits

#### cssTarget

���ͣ�`String` Ĭ��ֵ��`'**/styles'`

���css�ļ����Ŀ��·������·������ڵ�ǰ����Ĺ���·����Ĭ���Ǵ����Ӧ��·���µ� 'styles' �ļ���

**removeCombined**

���ͣ�`Boolean` Ĭ��ֵ��`true`

�Ƿ��Ƴ��ϲ���Ĺ����⣬Ĭ���� true�����������ᱻ����Ӧ�������ã���Ӧ��Ϊ false

### ʾ��

#### ��С����Ŀ

* Ŀ¼�ṹ

```
���� app
   ������ widgets
   |   ������ base
   |   ��   ������ header/
   |   ��   ������ portal/
   |   ������ music
   |   ��   ������ widget1/
   |   ��   ������ widget2/
   |   ������ account
   |       ������ widget3/
   ������ main.js
   ������ require-conf.js
���� release/
���� Gruntfile.js
```

* �������

```
options: {
    appDir: './app',
    baseUrl: '.',
    dir: './release',
    reqConfig: require('./app/require-conf.js')(),
    modules: [{
        name: '.',
        source: '.',
        subpaths: [
            './widgets/base',
            './widgets/music',
            './widgets/account'
        ]
    }]
}
```

#### �Դ�����Ŀ

* Ŀ¼�ṹ

```
���� root
   ������ modules-A
   |   ������ music
   |     ������ widgets/
   |     ������ plugins/
   |     ������ main.js 
   ������ modules-B
   |   ������ account
   |   |   ������ widgets/
   |   |   ������ plugins/
   |   |   ���� main.js
   |   ������ group
   |       ������ widgets/
   |       ������ plugins/
   |       ������ main.js 
   ������ solutions
   |   ������ build.js
   |���� project-main
   |  ������ modules-core
   |  |   ������ base
   |  |     ������ widgets
   |  |       ������ header/
   |  |       ������ portal/
   |  ������ main.js
   |  ������ require-conf.js
   ������ release
   ������ Gruntfile.js
        
```

* �������

solutions/build.js

```js
����
return {
    // ģ��
    modules: [{
           name: 'music',
           source: '../modules-A'
       } , {
           name: 'account',
           source: './modules-B'
       }, {
        name: 'group',
        source: '../modules-B'
    }]
����
```

Gruntfile.js

```
options: {
    appDir: './project/project-large/proj-main',
    baseUrl: '.',
    dir: './release',
    reqConfig: require('./project-main/modules-core/require-conf.js')(),
    solution: './solutions/build.js',
    modules: require('./solutions/build.js').modules
}
```

## Release History
_(Nothing yet)_
