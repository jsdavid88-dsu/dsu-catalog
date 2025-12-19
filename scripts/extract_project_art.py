import fitz  # PyMuPDF
import os

def render_project_pages(pdf_path, project_name, year, start_page, end_page):
    print(f"Propcessing {project_name} ({year})...")
    output_dir = f"d:/Antigravity/DSU_Graduation_Catalog/public/assets/projects/{year}/{project_name}"
    os.makedirs(output_dir, exist_ok=True)
    
    doc = fitz.open(pdf_path)
    
    # Page index is 0-based in fitz, user provided 1-based
    for i in range(start_page - 1, end_page):
        page = doc[i]
        # Standard DPI is 72. 4.1666x zoom gives 300 DPI (approx)
        # We'll use 2.0x for a good balance of quality and size (144 DPI)
        zoom = 2.0 
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        
        output_file = f"{output_dir}/page_{i+1:03}.png"
        pix.save(output_file)
        print(f"  Saved page {i+1} to {output_file}")
    
    doc.close()

if __name__ == "__main__":
    assets_dir = "d:/Antigravity/DSU_Graduation_Catalog/assets"
    
    tasks = [
        # 2024
        ("2024_Artbook_HQ.pdf", "first_love_tooth", 2024, 33, 42),
        ("2024_Artbook_HQ.pdf", "ah_its_a_frog", 2024, 1, 12),
        ("2024_Artbook_HQ.pdf", "flashback", 2024, 13, 22),
        ("2024_Artbook_HQ.pdf", "catcher", 2024, 23, 31),
        ("2024_Artbook_HQ.pdf", "catake", 2024, 49, 58),
        
        # 2023
        ("2023_Artbook_Ebook.pdf", "snowcchio", 2023, 3, 13),
        ("2023_Artbook_Ebook.pdf", "i_poisoned_your_tea", 2023, 14, 22),
        ("2023_Artbook_Ebook.pdf", "hitchhiker", 2023, 23, 32),
        ("2023_Artbook_Ebook.pdf", "purple_lilac", 2023, 33, 42),
        ("2023_Artbook_Ebook.pdf", "time_machine", 2023, 101, 109),
    ]
    
    for pdf, name, year, start, end in tasks:
        render_project_pages(os.path.join(assets_dir, pdf), name, year, start, end)
