import React from 'react';
import { AppView } from '../../types';

interface SettingsCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ icon, title, description, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-pink-50 transition-all cursor-pointer flex items-start gap-4"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
  >
    <i className={`fas ${icon} text-2xl text-pink-600 w-8 text-center mt-1`}></i>
    <div>
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <p className="text-base text-gray-600 mt-1">{description}</p>
    </div>
  </div>
);

interface AdminSettingsHubProps {
  onNavigate: (view: AppView) => void;
}

export const AdminSettingsHub: React.FC<AdminSettingsHubProps> = ({ onNavigate }) => {
  return (
    <div>
      <header className="md:sticky top-0 z-10 bg-gray-100 px-4 md:px-8 py-5 border-b border-gray-200">
        <h2 className="text-[1.75rem] font-bold text-gray-800">Configurações</h2>
      </header>
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SettingsCard
          icon="fa-calendar-plus"
          title="Agendar Serviço"
          description="Crie um novo agendamento em nome de um cliente."
          onClick={() => onNavigate('schedule')}
        />
        <SettingsCard
          icon="fa-chart-line"
          title="Relatórios"
          description="Visualize o faturamento, serviços mais populares e mais."
          onClick={() => onNavigate('reports')}
        />
        <SettingsCard
          icon="fa-cut"
          title="Serviços"
          description="Gerencie os tipos de serviços, preços e durações."
          onClick={() => onNavigate('services_admin')}
        />
        <SettingsCard
          icon="fa-user-tie"
          title="Profissionais"
          description="Adicione, edite ou remova profissionais e suas especialidades."
          onClick={() => onNavigate('professionals')}
        />
         <SettingsCard
          icon="fa-user-shield"
          title="Administradores"
          description="Controle quem tem acesso administrativo ao painel."
          onClick={() => onNavigate('admins')}
        />
         <SettingsCard
          icon="fa-clock"
          title="Horário do Salão"
          description="Defina os dias e horários de funcionamento."
          onClick={() => onNavigate('settings_admin')}
        />
      </div>
    </div>
  );
};