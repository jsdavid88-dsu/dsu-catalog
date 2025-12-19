import AdminLayout from '@/components/admin/AdminLayout';
import ProjectForm from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Add New Project</h1>
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg">
                <ProjectForm />
            </div>
        </AdminLayout>
    );
}
