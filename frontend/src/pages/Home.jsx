import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import VoiceButton from '../components/VoiceButton';
import ShoppingList from '../components/ShoppingList';
import AddItemForm from '../components/AddItemForm';
import EditModal from '../components/EditModal';
import CommandFeedback from '../components/CommandFeedback';
import Suggestions from '../components/Suggestions';
import SearchPanel from '../components/SearchPanel';
import RecipesPanel from '../components/RecipesPanel';
import EmojiBackground from '../components/EmojiBackground';
import {
  getItems, addItem, updateItem, deleteItem, clearList,
} from '../utils/api';

const TABS = [
  { id: 'list',        icon: '📋', label: 'List'        },
  { id: 'search',      icon: '🔍', label: 'Search'      },
  { id: 'suggestions', icon: '💡', label: 'Ideas'        },
  { id: 'recipes',     icon: '🤖', label: 'AI Recipes'  },
];

export default function Home() {
  const { user, logout } = useAuth();

  const [items,       setItems]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [mutating,    setMutating]    = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [feedback,    setFeedback]    = useState({ message: '', type: 'info' });
  const [activeTab,   setActiveTab]   = useState('list');

  const notify = (message, type = 'success') => setFeedback({ message, type });

  const fetchItems = useCallback(async () => {
    try {
      const { data } = await getItems();
      setItems(data);
    } catch (err) {
      console.error('fetchItems error:', err?.response?.data || err.message);
      // Don't notify here — the caller decides what error to surface
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleAdd = async ({ name, quantity, unit }) => {
    setMutating(true);
    try {
      const { data } = await addItem({ name, quantity, unit });
      setItems((prev) => [...prev, data]);
      notify(`✅ Added ${data.name}`);
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Add failed';
      notify(`❌ ${msg}`, 'error');
      console.error('addItem error:', err?.response?.status, msg);
    } finally {
      setMutating(false);
    }
  };

  const handleToggle = async (id, checked) => {
    setMutating(true);
    try {
      const { data } = await updateItem(id, { checked: checked ? 1 : 0 });
      setItems((prev) => prev.map((i) => (i.id === id ? data : i)));
    } catch {
      notify('Update failed.', 'error');
    } finally {
      setMutating(false);
    }
  };

  const handleDelete = async (id) => {
    setMutating(true);
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      notify('🗑️ Item removed');
    } catch {
      notify('Delete failed.', 'error');
    } finally {
      setMutating(false);
    }
  };

  const handleSaveEdit = async (id, fields) => {
    setMutating(true);
    try {
      const { data } = await updateItem(id, fields);
      setItems((prev) => prev.map((i) => (i.id === id ? data : i)));
      setEditingItem(null);
      notify(`✏️ Updated ${data.name}`);
    } catch {
      notify('Update failed.', 'error');
    } finally {
      setMutating(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear entire list?')) return;
    setMutating(true);
    try {
      await clearList();
      await fetchItems();
      notify('🧹 List cleared');
    } catch {
      notify('Clear failed.', 'error');
    } finally {
      setMutating(false);
    }
  };

  // Bulk-add for recipes panel
  const handleAddIngredients = async (itemList) => {
    setMutating(true);
    try {
      for (const item of itemList) {
        await addItem({ name: item.name, quantity: item.quantity, unit: item.unit });
      }
      await fetchItems();
      notify(`✅ Added ${itemList.length} ingredients to cart`);
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'unknown error';
      notify(`❌ Could not add ingredients: ${msg}`, 'error');
      console.error('handleAddIngredients error:', err?.response?.status, msg);
    } finally {
      setMutating(false);
    }
  };

  // Voice command dispatcher — calls API directly to avoid stale closure bugs.
  // fetchItems() is always called after any mutation so state stays in sync.
  const handleVoiceCommand = useCallback(async (command, transcript) => {
    switch (command.action) {
      case 'add': {
        setMutating(true);
        try {
          await addItem({ name: command.name, quantity: command.quantity, unit: command.unit });
          await fetchItems();
          notify(`✅ Added ${command.name}`);
        } catch {
          notify('Failed to add item.', 'error');
        } finally {
          setMutating(false);
        }
        break;
      }
      case 'add_multiple': {
        setMutating(true);
        try {
          for (const item of command.items) {
            await addItem({ name: item.name, quantity: item.quantity, unit: item.unit });
          }
          await fetchItems();
          notify(`✅ Added ${command.items.length} items`);
        } catch {
          notify('Failed to add some items.', 'error');
        } finally {
          setMutating(false);
        }
        break;
      }
      case 'remove': {
        const target = items.find((i) => i.name.toLowerCase().includes(command.name.toLowerCase()));
        if (!target) { notify(`❓ Couldn't find "${command.name}" in your list`, 'error'); break; }
        setMutating(true);
        try {
          await deleteItem(target.id);
          await fetchItems();
          notify(`🗑️ Removed ${target.name}`);
        } catch {
          notify('Delete failed.', 'error');
        } finally {
          setMutating(false);
        }
        break;
      }
      case 'check': {
        const target = items.find((i) => i.name.toLowerCase().includes(command.name.toLowerCase()));
        if (!target) { notify(`❓ Couldn't find "${command.name}"`, 'error'); break; }
        setMutating(true);
        try {
          await updateItem(target.id, { checked: 1 });
          await fetchItems();
          notify(`✅ Checked off ${target.name}`);
        } catch {
          notify('Update failed.', 'error');
        } finally {
          setMutating(false);
        }
        break;
      }
      case 'clear':
        await handleClear();
        break;
      case 'search':
        setActiveTab('search');
        notify(`🔍 Searching for "${command.query}"`);
        break;
      default:
        notify(`❓ Didn't understand: "${transcript}"`, 'error');
    }
  // items is needed for find(); fetchItems/handleClear are stable via useCallback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, fetchItems]);

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div className="app-layout">
      <EmojiBackground />
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-top">
          <div className="header-brand">
            <span className="title-icon">🛒</span>
            <div>
              <h1 className="app-title">VoiceCart</h1>
              {user && <p className="app-subtitle">Hey, {user.name || user.email.split('@')[0]}! 👋</p>}
            </div>
          </div>

          <button id="logout-btn" className="logout-btn" onClick={logout} title="Sign out">
            Sign out
          </button>
        </div>

        <VoiceButton onCommand={handleVoiceCommand} disabled={mutating} />

        <CommandFeedback
          message={feedback.message}
          type={feedback.type}
          key={feedback.message + Date.now()}
        />
      </header>

      {/* ── Navigation ── */}
      <nav className="main-nav" role="navigation" aria-label="Main navigation">
        {TABS.map(({ id, icon, label }) => (
          <button
            key={id}
            id={`nav-${id}`}
            className={`nav-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </button>
        ))}
      </nav>

      {/* ── Content ── */}
      <main className="main-content">
        {activeTab === 'list' && (
          <>
            <AddItemForm onAdd={handleAdd} loading={mutating} />

            <div className="list-stats">
              <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
              {checkedCount > 0 && <span className="checked-count">{checkedCount} checked</span>}
              {items.length > 0 && (
                <button id="clear-list-btn" className="clear-btn" onClick={handleClear}>
                  Clear all
                </button>
              )}
            </div>

            <ShoppingList
              items={items}
              loading={loading}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={setEditingItem}
            />
          </>
        )}

        {activeTab === 'search' && <SearchPanel onAdd={handleAdd} />}

        {activeTab === 'suggestions' && <Suggestions onAdd={handleAdd} />}

        {activeTab === 'recipes' && <RecipesPanel onAddIngredients={handleAddIngredients} />}
      </main>

      {editingItem && (
        <EditModal
          item={editingItem}
          onSave={handleSaveEdit}
          onClose={() => setEditingItem(null)}
          loading={mutating}
        />
      )}
    </div>
  );
}
