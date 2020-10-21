#!/bin/bash -euo pipefail
snv_reporting.py -i 0.vcf -o 0.json -g GRCh37 -k /nextflow_pipeline/nf-core-clinvap/assets/cancerDB_final.json
