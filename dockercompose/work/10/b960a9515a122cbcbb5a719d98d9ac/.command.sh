#!/bin/bash -euo pipefail
snv_reporting.py -i mirjamfi_0.vcf -o mirjamfi_0.json -g GRCh37 -k /nextflow_pipeline/nf-core-clinvap/assets/cancerDB_final.json
