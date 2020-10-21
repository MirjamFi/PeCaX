#!/bin/bash -euo pipefail
snv_reporting.py -i annotated_strelka.vcf -o annotated_strelka.json -g GRCh37 -k /nextflow_pipeline/nf-core-clinvap/assets/cancerDB_final.json
