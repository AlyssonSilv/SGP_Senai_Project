import React, { useState } from 'react';

// Tipagem para o TypeScript
interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

const Usuarios: React.FC = () => {
  // Estado para o formulário
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '' });
  
  // Estado para a lista de usuários (Mock inicial)
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: '1', nome: 'Alysson (Admin)', email: 'admin@empresa.com.br', telefone: '(98) 99999-0000' }
  ]);

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const novoUsuario: Usuario = {
      id: Date.now().toString(),
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone
    };
    
    // Adiciona o novo usuário na lista e limpa o formulário
    setUsuarios([...usuarios, novoUsuario]);
    setFormData({ nome: '', email: '', telefone: '' });
    alert('Usuário adicionado com sucesso!');
  };

  const handleRemoveUser = (id: string) => {
    if(window.confirm('Tem certeza que deseja remover este usuário?')) {
      setUsuarios(usuarios.filter(user => user.id !== id));
    }
  };

  return (
    <section className="card pad" style={{ maxWidth: '980px' }}>
      <div className="h1">Usuários da Empresa</div>
      <div className="p">Gerencie quais funcionários podem acessar o sistema e solicitar treinamentos.</div>
      
      {/* Formulário de Adição */}
      <form onSubmit={handleAddUser} className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr auto', gap: '14px', marginTop: '20px', alignItems: 'end' }}>
        <div>
          <label htmlFor="usrNome" className="label">Nome Completo</label>
          <input id="usrNome" className="input" required title="Nome do usuário" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
        </div>
        <div>
          <label htmlFor="usrEmail" className="label">E-mail Corporativo</label>
          <input id="usrEmail" className="input" type="email" required title="E-mail do usuário" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label htmlFor="usrFone" className="label">Telefone</label>
          <input id="usrFone" className="input" placeholder="(99) 99999-9999" required title="Telefone do usuário" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
        </div>
        <div>
          <button type="submit" className="btn primary" style={{ height: '45px' }}>Adicionar</button>
        </div>
      </form>

      <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '30px 0' }} />

      {/* Tabela de Usuários */}
      <div className="h2">Usuários Cadastrados</div>
      <div style={{ overflowX: 'auto', marginTop: '10px' }}>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id}>
                <td><strong>{user.nome}</strong></td>
                <td>{user.email}</td>
                <td>{user.telefone}</td>
                <td>
                  <button onClick={() => handleRemoveUser(user.id)} className="btn danger" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Remover
                  </button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)' }}>Nenhum usuário cadastrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Usuarios;