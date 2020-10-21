#!/bin/bash -euo pipefail
snv_reporting.py -i mirjamfi_1.vcf -o mirjamfi_1.json -g GRCh37 -k /nextflow_pipeline/nf-core-clinvap/assets/cancerDB_final.json
