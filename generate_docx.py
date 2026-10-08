import pypandoc

input_file = "docs/SRS_AGRO_XAI.md"
output_file = "docs/SRS_AGRO_XAI.docx"

try:
    print(f"Converting {input_file} to {output_file}...")
    pypandoc.convert_file(input_file, 'docx', outputfile=output_file)
    print("Conversion successful!")
except Exception as e:
    print(f"Error during conversion: {e}")
