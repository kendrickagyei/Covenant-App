import { useMemo, useState } from 'react';
import { Calendar, ChevronDown, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import '../assets/main.css';
import { useApiData } from '../store/useApiData.js';
import { createRecord as apiCreateRecord } from '../store/api.js';

const CUSTOM_CAT_KEY = 'covenant-custom-categories';
const MAX_CUSTOM_LABEL_LENGTH = 80;

// ── helpers ────────────────────────────────────────────────────────

/** Capitalise the first letter of every word in a string. */
const capitalise = (str) =>
  str
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const cleanLabel = (value) => capitalise(value).slice(0, MAX_CUSTOM_LABEL_LENGTH);

/** Load saved custom categories from localStorage. */
const getCustomCategories = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(CUSTOM_CAT_KEY)) || {};
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    return Object.entries(parsed).reduce((safeCats, [category, subcategories]) => {
      const safeCategory = cleanLabel(category);
      if (!safeCategory) return safeCats;
      safeCats[safeCategory] = Array.isArray(subcategories)
        ? [...new Set(subcategories.map(cleanLabel).filter(Boolean))]
        : [];
      return safeCats;
    }, {});
  } catch {
    return {};
  }
};

/** Save custom categories to localStorage. */
const saveCustomCategories = (cats) => {
  try {
    localStorage.setItem(CUSTOM_CAT_KEY, JSON.stringify(cats));
  } catch {
    // Ignore storage errors.
  }
};

/** Add a new custom category (with an empty subcategory array). */
const addCustomCategory = (name) => {
  if (!name) return;
  const cats = getCustomCategories();
  if (!cats[name]) cats[name] = [];
  saveCustomCategories(cats);
};

/** Add a custom subcategory to an existing category. */
const addCustomSubcategory = (category, sub) => {
  if (!category || !sub) return;
  const cats = getCustomCategories();
  if (!cats[category]) cats[category] = [];
  if (!cats[category].includes(sub)) cats[category].push(sub);
  saveCustomCategories(cats);
};

/** Get all categories from data + custom. */
const allCategories = (records) => {
  const dataCats = [...new Set(records.map((r) => r.category).filter(Boolean))];
  const customCats = Object.keys(getCustomCategories());
  return [...new Set([...dataCats, ...customCats])].sort();
};

/** Get subcategories for a category from data + custom. */
const getSubcategoriesForCategory = (records, category) => {
  const dataSubs = [
    ...new Set(
      records
        .filter((r) => r.category === category)
        .map((r) => r.subcategory)
        .filter(Boolean)
    )
  ];
  const customSubs = getCustomCategories()[category] || [];
  return [...new Set([...dataSubs, ...customSubs])].sort();
};

// ── component ───────────────────────────────────────────────────────

const Expenses = () => {
  const { data, loading, refresh } = useApiData();
  const records = data.church_expense_tracker.records || [];
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => {
    const cats = allCategories(records);
    const firstCat = cats[0] || '';
    const firstSub = getSubcategoriesForCategory(records, firstCat)[0] || '';
    return {
      date: '2026-01-04',
      type: 'income',
      category: firstCat,
      subcategory: firstSub,
      amount: 1850,
      remarks: 'First Sunday offertory — January',
      recorded_by: 'Treasurer'
    };
  });

  // Track whether the user is typing a brand-new value
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isNewSubcategory, setIsNewSubcategory] = useState(false);

  const subcategoryOptions = useMemo(
    () => getSubcategoriesForCategory(records, formData.category),
    [records, formData.category]
  );

  // ── change handlers ──────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const nextValue = ['category', 'subcategory', 'remarks', 'recorded_by'].includes(name)
        ? capitalise(value)
        : value;
      const next = { ...prev, [name]: nextValue };

      // When switching to an existing category, reset subcategory
      if (name === 'category') {
        const subs = getSubcategoriesForCategory(records, value);
        next.subcategory = subs[0] || '';
        setIsNewSubcategory(false);
      }
      return next;
    });
  };

  /**
   * Called when the user selects "＋ Add new…" in the category dropdown.
   * Switches to a text input so they can type a brand-new category.
   */
  const handleCategorySelect = (e) => {
    const val = e.target.value;
    if (val === '__new__') {
      setIsNewCategory(true);
      setFormData((prev) => ({ ...prev, category: '', subcategory: '' }));
      setIsNewSubcategory(false);
    } else {
      setIsNewCategory(false);
      handleChange(e);
    }
  };

  /**
   * Called when the user finishes typing a new category name.
   * Saves it to localStorage and switches back to dropdown.
   */
  const handleNewCategoryBlur = () => {
    const name = formData.category.trim();
    if (name) {
      const capped = cleanLabel(name);
      addCustomCategory(capped);
      setFormData((prev) => ({ ...prev, category: capped }));
      // Refresh so next time it appears in the dropdown
    }
    setIsNewCategory(false);
  };

  const handleNewCategoryKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNewCategoryBlur();
    }
  };

  const handleSubcategorySelect = (e) => {
    const val = e.target.value;
    if (val === '__new__') {
      setIsNewSubcategory(true);
      setFormData((prev) => ({ ...prev, subcategory: '' }));
    } else {
      setIsNewSubcategory(false);
      handleChange(e);
    }
  };

  const handleNewSubcategoryBlur = () => {
    const name = formData.subcategory.trim();
    if (name) {
      const capped = cleanLabel(name);
      addCustomSubcategory(formData.category, capped);
      setFormData((prev) => ({ ...prev, subcategory: capped }));
    }
    setIsNewSubcategory(false);
  };

  const handleNewSubcategoryKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNewSubcategoryBlur();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(formData.amount);
    if (!Number.isFinite(amount) || amount < 0) {
      setSubmitStatus({ type: 'error', message: 'Amount must be a non-negative number' });
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await apiCreateRecord({
        date: formData.date,
        type: formData.type,
        category: formData.category,
        subcategory: formData.subcategory,
        amount,
        remarks: formData.remarks,
        recorded_by: formData.recorded_by
      });
      setSubmitStatus({ type: 'success', message: 'Record created successfully!' });
      refresh();
    } catch (err) {
      setSubmitStatus({ type: 'error', message: err.message || 'Failed to create record' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData((prev) => ({
      ...prev,
      date: '',
      amount: '',
      remarks: '',
      recorded_by: ''
    }));
  };

  // ── render ────────────────────────────────────────────────────────

  const renderCategoryField = () => {
    if (isNewCategory) {
      return (
        <div className="form-group">
          <label className="field-label">New Category</label>
          <div className="input-with-icon">
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              onBlur={handleNewCategoryBlur}
              onKeyDown={handleNewCategoryKeyDown}
              placeholder="Type new category name…"
              className="form-input"
              autoFocus
            />
          </div>
        </div>
      );
    }

    return (
      <div className="form-group">
        <label className="field-label">Category</label>
        <div className="input-with-icon">
          <select
            name="category"
            value={formData.category}
            onChange={handleCategorySelect}
            className="form-select"
          >
            {allCategories(records).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="__new__">＋ Add new…</option>
          </select>
          <ChevronDown className="input-icon-right" size={16} />
        </div>
      </div>
    );
  };

  const renderSubcategoryField = () => {
    if (isNewSubcategory) {
      return (
        <div className="form-group">
          <label className="field-label">New Subcategory</label>
          <div className="input-with-icon">
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subcategory: e.target.value }))
              }
              onBlur={handleNewSubcategoryBlur}
              onKeyDown={handleNewSubcategoryKeyDown}
              placeholder="Type new subcategory name…"
              className="form-input"
              autoFocus
            />
          </div>
        </div>
      );
    }

    return (
      <div className="form-group">
        <label className="field-label">Subcategory</label>
        <div className="input-with-icon">
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleSubcategorySelect}
            className="form-select"
          >
            {subcategoryOptions.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
            <option value="__new__">＋ Add new…</option>
          </select>
          <ChevronDown className="input-icon-right" size={16} />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="expense-container">
        <div className="expense-card">
          <div className="expense-header">
            <div>
              <h1 className="expense-title">Transaction Recorder</h1>
            </div>
          </div>
          <p style={{ padding: '32px', color: 'var(--text-secondary)' }}>Loading data from server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-container">
      <div className="expense-card">
        {/* Header Section */}
        <div className="expense-header">
          <div>
            <h1 className="expense-title">Transaction Recorder</h1>
            <p className="expense-subtitle">
              Create a record for an incoming transaction for the account
            </p>
          </div>
          <button type="button" className="btn-black btn-small">
            Transaction Details
          </button>
        </div>

        {/* Form Body */}
        {submitStatus && (
            <div className={`import-status import-status-${submitStatus.type}`}>
              {submitStatus.type === 'success' ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <span>{submitStatus.message}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-fields-container">
            {/* Sub-header inside container */}
            <div className="fields-section-title">
              <FileText className="icon-fields" size={16} />
              <span>Fields</span>
            </div>

            {/* Form Fields Grid */}
            <div className="fields-grid">
              {/* Date Field */}
              <div className="form-group">
                <label className="field-label">Date</label>
                <div className="input-with-icon">
                  <Calendar className="input-icon-left" size={16} />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="form-input has-icon-left"
                  />
                </div>
              </div>

              {/* Type Field */}
              <div className="form-group">
                <label className="field-label">Type</label>
                <div className="input-with-icon">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <ChevronDown className="input-icon-right" size={16} />
                </div>
              </div>

              {/* Category Field */}
              {renderCategoryField()}

              {/* Subcategory Field */}
              {renderSubcategoryField()}

              {/* Amount Field */}
              <div className="form-group">
                <label className="field-label">Amount</label>
                <div className="input-with-icon">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="form-input generic-input"
                  />
                  <div className="currency-badge">¢</div>
                </div>
              </div>

              {/* Remarks Field */}
              <div className="form-group">
                <label className="field-label">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="3"
                  className="form-textarea"
                />
              </div>

              {/* Recorded By Field */}
              <div className="form-group">
                <label className="field-label">Recorded By</label>
                <input
                  type="text"
                  name="recorded_by"
                  value={formData.recorded_by}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="form-actions">
            <button type="submit" className="btn-black btn-large" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="btn-black btn-large"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Expenses;
