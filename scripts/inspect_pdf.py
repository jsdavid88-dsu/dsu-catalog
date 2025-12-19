import fitz  # PyMuPDF
import sys

def inspect_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    print(f"\n{'='*60}")
    print(f"PDF: {pdf_path}")
    print(f"{'='*60}")
    print(f"Total Pages: {len(doc)}")
    print(f"PDF Size: {doc.metadata.get('format', 'Unknown')}")

    # Sample first 3 pages
    for page_num in range(min(3, len(doc))):
        page = doc[page_num]
        print(f"\n--- Page {page_num + 1} ---")
        print(f"Size: {page.rect.width:.1f} x {page.rect.height:.1f}")

        # Check images
        images = page.get_images()
        print(f"Images: {len(images)}")

        # Check text
        text = page.get_text().strip()
        text_preview = text[:200].replace('\n', ' ') if text else "No text"
        print(f"Text preview: {text_preview}...")

        # Check if page has drawings
        drawings = page.get_drawings()
        print(f"Vector drawings: {len(drawings)}")

    doc.close()

if __name__ == "__main__":
    pdfs = [
        "assets/2023_Artbook_Ebook.pdf",
        "assets/2024_Artbook_HQ.pdf",
        "assets/Art_of_DSU_ANI_2020.pdf"
    ]

    for pdf in pdfs:
        try:
            inspect_pdf(pdf)
        except Exception as e:
            print(f"Error with {pdf}: {e}")
