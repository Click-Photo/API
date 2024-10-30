const adminService = require('../services/adminService');

module.exports = {
    async getAllAdmins(req, res) {
        try {
            const admins = await adminService.getAllAdmins();
            res.status(200).json(admins);
        } catch (err) {
            console.error('admins não encontrados', err);
            res.status(500).json({ message: "Administradores não encontrados" });
        }
    },

    async createAdmin(req, res) {
        const { nome, telefone, email, CPF, CEP, senha } = req.body;

        try {
            await adminService.createAdmin(nome, telefone, email, CPF, CEP, senha);
            res.status(201).json({ message: 'Administrador criado com sucesso' });
        } catch (err) {
            console.error('Erro ao criar administrador', err);
            if (err.message === 'E-mail já cadastrado') {
                res.status(400).json({ message: 'E-mail já cadastrado' });
            } else {
                res.status(500).json({ message: 'Erro ao criar administrador' });
            }
        }
    },
    
    async getAllFotografos(req, res) {
        try {
            const fotografos = await adminService.getAllFotografos();
            res.status(200).json(fotografos);
        } catch (err) {
            console.error('Erro ao buscar fotógrafos', err);
            res.status(500).json({ message: "Erro ao buscar fotógrafos" });
        }
    },

    async getAllClientes(req, res) {
        try {
            const clientes = await adminService.getAllClientes();
            res.status(200).json(clientes);
        } catch (err) {
            console.error('Erro ao buscar clientes', err);
            res.status(500).json({ message: "Erro ao buscar clientes" });
        }
    },

    async addCliente(req, res) {
        try {
            const clienteData = req.body;
            await adminService.addCliente(clienteData);
            res.status(201).json({ message: 'Cliente adicionado com sucesso' });
        } catch (err) {
            console.error('Erro ao adicionar cliente', err);
            res.status(500).json({ message: "Erro ao adicionar cliente" });
        }
    },

    async deleteCliente(req, res) {
        try {
            const { id } = req.params;
            await adminService.deleteCliente(id);
            res.status(200).json({ message: 'Cliente excluído com sucesso' });
        } catch (err) {
            console.error('Erro ao excluir cliente', err);
            res.status(500).json({ message: "Erro ao excluir cliente" });
        }
    },

    async addFotografo(req, res) {
        try {
            const fotografoData = req.body;
            await adminService.addFotografo(fotografoData);
            res.status(201).json({ message: 'Fotógrafo adicionado com sucesso' });
        } catch (err) {
            console.error('Erro ao adicionar fotógrafo', err);
            res.status(500).json({ message: "Erro ao adicionar fotógrafo" });
        }
    },

    async deleteFotografo(req, res) {
        try {
            const { id } = req.params;
            await adminService.deleteFotografo(id);
            res.status(200).json({ message: 'Fotógrafo excluído com sucesso' });
        } catch (err) {
            console.error('Erro ao excluir fotógrafo', err);
            res.status(500).json({ message: "Erro ao excluir fotógrafo" });
        }
    },

    async deleteJob(req, res) {
        try {
            const { jobId } = req.params;
            await adminService.deleteJob(jobId);
            res.status(200).json({ message: 'Job excluído com sucesso' });
        } catch (err) {
            console.error('Erro ao excluir job', err);
            res.status(500).json({ message: "Erro ao excluir job" });
        }
    },

    async deletePortfolioImage(req, res) {
        try {
            const { imageId } = req.params;
            await adminService.deletePortfolioImage(imageId);
            res.status(200).json({ message: 'Imagem do portfólio excluída com sucesso' });
        } catch (err) {
            console.error('Erro ao excluir imagem do portfólio', err);
            res.status(500).json({ message: "Erro ao excluir imagem do portfólio" });
        }
    },

    async addAdmin(req, res) {
        try {
            const adminData = req.body;
            await adminService.addAdmin(adminData);
            res.status(201).json({ message: 'Administrador adicionado com sucesso' });
        } catch (err) {
            console.error('Erro ao adicionar administrador', err);
            res.status(500).json({ message: "Erro ao adicionar administrador" });
        }
    },

    async loginAdmin(req, res) {
        const { email, senha } = req.body;
        try {
            const { token, admin } = await adminService.loginAdmin(email, senha);
            res.status(200).json({ token, admin });
        } catch (err) {
            console.error('Erro no login do administrador', err);
            res.status(401).json({ message: 'Credenciais inválidas' });
        }
    },

    async getUserCounts(req, res) {
        try {
            const counts = await adminService.countUsers();
            res.status(200).json(counts);
        } catch (err) {
            console.error('Erro ao obter contagem de usuários', err);
            res.status(500).json({ message: "Erro ao obter contagem de usuários" });
        }
    },
};
