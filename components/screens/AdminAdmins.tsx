import React, { useState, useEffect } from 'react';
import { Admin } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal, ConfirmationModal } from '../ui/Modal';
import { useToast } from '../../context/ToastContext';
import * as api from '../../api';
import { TableSkeleton, CardSkeleton } from '../ui/Skeleton';

const emptyAdmin: Admin = { id: '', name: '' };

export const AdminAdmins: React.FC = () => {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const data = await api.getAdmins();
                setAdmins(data);
            } catch (error) {
                addToast('Falha ao carregar administradores.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAdmins();
    }, [addToast]);

    const openModalToAdd = () => {
        setEditingAdmin(emptyAdmin);
        setIsModalOpen(true);
    };

    const openModalToEdit = (admin: Admin) => {
        setEditingAdmin(admin);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingAdmin) return;
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const adminData = {
            ...editingAdmin,
            name: formData.get('name') as string,
            // Password would be handled securely in a real app
        };

        try {
            const savedAdmin = await api.saveAdmin(adminData);
            if (editingAdmin.id) {
                setAdmins(admins.map(a => a.id === savedAdmin.id ? savedAdmin : a));
            } else {
                setAdmins([...admins, savedAdmin]);
            }
            addToast(`Administrador "${savedAdmin.name}" salvo com sucesso!`, 'success');
            setIsModalOpen(false);
            setEditingAdmin(null);
        } catch (error) {
            addToast('Falha ao salvar administrador.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDeleteConfirmation = (id: string) => {
        setAdminToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!adminToDelete) return;
        setDeletingId(adminToDelete);
        setIsConfirmModalOpen(false);
        try {
            await api.deleteAdmin(adminToDelete);
            setAdmins(admins.filter(c => c.id !== adminToDelete));
            addToast('Administrador excluído com sucesso.', 'success');
        } catch (error) {
            addToast('Falha ao excluir administrador.', 'error');
        } finally {
            setDeletingId(null);
            setAdminToDelete(null);
        }
    };

    return (
        <div>
            <header className="md:sticky top-0 z-10 bg-gray-100 px-4 md:px-8 py-5 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-[1.75rem] font-bold text-gray-800">Gerenciar Administradores</h2>
                    <Button onClick={openModalToAdd}>
                        <i className="fas fa-plus mr-2"></i>
                        Adicionar Administrador
                    </Button>
                </div>
            </header>
            
            <div className="p-4 md:p-6">
                <div className="bg-white p-5 rounded-xl shadow-md">
                    {isLoading ? (
                        <>
                            <div className="hidden md:block"><TableSkeleton columns={2} /></div>
                            <div className="md:hidden"><CardSkeleton /></div>
                        </>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="overflow-x-auto hidden md:block">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="p-2 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
                                            <th className="p-2 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {admins.map(admin => (
                                            <tr key={admin.id} className="border-b hover:bg-gray-50">
                                                <td className="p-2 text-base text-gray-800 font-medium">{admin.name}</td>
                                                <td className="p-2">
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" className="text-pink-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => openModalToEdit(admin)}>Editar</Button>
                                                        <Button variant="ghost" className="text-red-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => openDeleteConfirmation(admin.id)} isLoading={deletingId === admin.id}>{deletingId === admin.id ? '' : 'Excluir'}</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="space-y-3 md:hidden">
                                {admins.map(admin => (
                                    <div key={admin.id} className="p-3 border rounded-lg bg-gray-50">
                                        <p className="font-bold text-lg text-gray-800">{admin.name}</p>
                                        <div className="mt-4 pt-3 border-t flex justify-end gap-2">
                                            <Button variant="ghost" className="text-pink-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => openModalToEdit(admin)}>Editar</Button>
                                            <Button variant="ghost" className="text-red-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => openDeleteConfirmation(admin.id)} isLoading={deletingId === admin.id}>{deletingId === admin.id ? '' : 'Excluir'}</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {editingAdmin && (
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    title={editingAdmin.id ? 'Editar Administrador' : 'Novo Administrador'}
                >
                    <form onSubmit={handleSave} className="space-y-4">
                        <Input id="name" name="name" type="text" label="Nome" defaultValue={editingAdmin.name} required />
                        <Input id="password" name="password" type="password" label="Senha" placeholder="Deixe em branco para não alterar" />
                        
                        <div className="flex gap-4 pt-4 border-t">
                            <Button type="submit" isLoading={isSubmitting}>Salvar</Button>
                            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        </div>
                    </form>
                </Modal>
            )}

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                confirmText="Sim, Excluir"
                isConfirming={!!deletingId}
            >
                <p>Tem certeza que deseja excluir este administrador? Ele perderá o acesso ao painel de controle. Esta ação não pode ser desfeita.</p>
            </ConfirmationModal>
        </div>
    );
};