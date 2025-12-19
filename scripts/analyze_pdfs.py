import fitz  # PyMuPDF
import sys
import os
import io

# Set encoding for Windows console
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def analyze_pdf(pdf_path):
    print(f"Analyzing: {pdf_path}")
    if not os.path.exists(pdf_path):
        print("File not found.")
        return

    doc = fitz.open(pdf_path)
    print(f"Total Pages: {len(doc)}")
    
    # Check TOC
    toc = doc.get_toc()
    if toc:
        print("\nTable of Contents:")
        for entry in toc[:20]:
            print(f"{'  ' * (entry[0]-1)}{entry[1]} (Page {entry[2]})")
    else:
        print("\nNo TOC found in metadata.")

    # Check first 20 pages for titles/keywords
    print("\nPage Summary (Images & Text Snippets):")
    for i in range(min(50, len(doc))):
        page = doc[i]
        text = page.get_text().strip().replace('\n', ' ')
        img_count = len(page.get_images())
        snippet = text[:100]
        if snippet:
            print(f"Page {i+1:3}: {img_count:2} images | Text: {snippet}...")
        else:
            print(f"Page {i+1:3}: {img_count:2} images | (No text)")
    
    doc.close()

if __name__ == "__main__":
    assets_dir = "d:/Antigravity/DSU_Graduation_Catalog/assets"
    pdfs = [
        "2024_Artbook_HQ.pdf",
        "2023_Artbook_Ebook.pdf"
    ]
    for pdf in pdfs:
        analyze_pdf(os.path.join(assets_dir, pdf))
        print("\n" + "="*50 + "\n")
