const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Les variables d\'environnement SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sot requises.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('Users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des utilisateurs',
                error: error.message
            });
        }

        console.log('Utilisateurs récupérés:', data);
        res.json({
            success: true,
            data: data,
            count: data.length
        });

    } catch (error) {
        console.error('Erreur dans getAllUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

// Fonction pour récupérer un utilisateur par ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
            .from('Users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé',
                error: error.message
            });
        }

        console.log('Utilisateur récupéré:', data);
        res.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error('Erreur dans getUserById:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

// Fonction pour rechercher des utilisateurs
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Paramètre de recherche requis'
            });
        }

        const { data, error } = await supabase
            .from('Users')
            .select('*')
            .or(`email.ilike.%${query}%, nom.ilike.%${query}%, prenom.ilike.%${query}%`)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erreur lors de la recherche:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de la recherche',
                error: error.message
            });
        }

        console.log('Résultats de recherche:', data);
        res.json({
            success: true,
            data: data,
            count: data.length,
            query: query
        });

    } catch (error) {
        console.error('Erreur dans searchUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

// Fonction pour obtenir les statistiques des utilisateurs
const getUserStats = async (req, res) => {
    try {
        // Compter le total des utilisateurs
        const { count: totalUsers, error: countError } = await supabase
            .from('Users')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            throw countError;
        }

        // Compter les utilisateurs actifs
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count: activeUsers, error: activeError } = await supabase
            .from('Users')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', thirtyDaysAgo.toISOString());

        if (activeError) {
            throw activeError;
        }

        console.log('Statistiques utilisateurs:', {
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers
        });

        res.json({
            success: true,
            stats: {
                totalUsers,
                activeUsers,
                inactiveUsers: totalUsers - activeUsers
            }
        });

    } catch (error) {
        console.error('Erreur dans getUserStats:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};
const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Validation de base
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID utilisateur manquant'
        });
      }
      
      if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Aucune donnée à modifier'
        });
      }
      
      // Champs autorisés (sécurité)
      const allowedFields = ['nom', 'prenom', 'email', 'telephone'];
      const cleanUpdates = {};
      
      // Filtrer et nettoyer les données
      Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key) && updates[key] !== undefined) {
          // Nettoyer les chaînes de caractères
          if (typeof updates[key] === 'string') {
            cleanUpdates[key] = updates[key].trim();
          } else {
            cleanUpdates[key] = updates[key];
          }
        }
      });
      
      if (Object.keys(cleanUpdates).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Aucun champ valide à modifier'
        });
      }
      
      // Ajouter timestamp de modification
      cleanUpdates.updated_at = new Date().toISOString();
      
      console.log('✏️ Modification utilisateur ID:', id);
      console.log('📝 Champs modifiés:', Object.keys(cleanUpdates));
      
      // Modification avec Supabase
      const { data, error } = await supabase
        .from('Users')
        .update(cleanUpdates)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('❌ Erreur Supabase:', error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }
      
      // Vérifier si l'utilisateur a été trouvé
      if (!data || data.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }
      
      console.log('✅ Utilisateur modifié avec succès:', data[0]);
      
      res.json({
        success: true,
        message: `Utilisateur modifié avec succès`,
        data: data[0],
        modified_fields: Object.keys(cleanUpdates)
      });
      
    } catch (error) {
      console.error('💥 Erreur serveur:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  };
  const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { confirm } = req.body; // Confirmation depuis le body
      
      // Validation de l'ID
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID utilisateur manquant'
        });
      }
      
      // Validation de la confirmation
      if (!confirm || confirm !== 'DELETE') {
        return res.status(400).json({
          success: false,
          error: 'Confirmation requise',
          required_confirmation: 'DELETE',
          message: 'Envoyez { "confirm": "DELETE" } dans le body pour confirmer'
        });
      }
      
      console.log('🗑️ Suppression confirmée pour utilisateur ID:', id);
      
      // Optionnel : Récupérer l'utilisateur avant suppression
      const { data: existingUser, error: fetchError } = await supabase
        .from('Users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError || !existingUser) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }
      
      console.log('👤 Utilisateur à supprimer:', existingUser);
      
      // Suppression avec Supabase
      const { data, error } = await supabase
        .from('Users')
        .delete()
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('❌ Erreur Supabase:', error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }
      
      console.log('✅ Utilisateur supprimé avec succès');
      
      res.json({
        success: true,
        message: `Utilisateur ${existingUser.nom} ${existingUser.prenom} supprimé avec succès`,
        deleted_user: existingUser,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('💥 Erreur serveur:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  };
  
  // Route DELETE
  

module.exports = {
    getAllUsers,
    getUserById,
    searchUsers,
    getUserStats,
    updateUser,
    deleteUser
};