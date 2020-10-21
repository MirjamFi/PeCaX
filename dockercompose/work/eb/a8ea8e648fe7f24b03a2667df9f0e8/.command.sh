#!/bin/bash -euo pipefail
git clone -b release/95 https://github.com/Ensembl/ensembl-vep.git
cd ensembl-vep
perl INSTALL.pl --NO_HTSLIB -n --CACHE_VERSION 95 --CACHEDIR './offline_cache' --VERSION 95 -a acf -s homo_sapiens -y GRCh37
wget 'https://raw.githubusercontent.com/Ensembl/VEP_plugins/release/90/LoFtool_scores.txt'
