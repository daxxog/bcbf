bcbf
====

(B)ar(C)ode (B)rute (F)orce
---------------------------
WARNING: super dirty untested pre-alpha version!

Dependencies
------------
* nodejs
* zint
* imagemagick
* gzip

Install (try sudo)
-------
stable
```bash
npm install -g bcbf
```
edge
```bash
npm install -g https://github.com/daxxog/bcbf/tarball/master

Examples
--------
```bash
#create 5 barcodes with the .png format
bcbf

#create 10 barcodes with the .png format
bcbf 10 png

#create 10 barcodes with the .svg format
bcbf 10 svg

#create 15 barcodes with .svg and .png formats
bcbf 15 svgpng

#create 20 barcodes with the .svg.gz format
bcbf 20 svgz
```
