import { useState } from 'react';
import { Calendar, ChevronDown, FileText } from 'lucide-react';
import '../assets/main.css';

const Expenses = () => {
  const [formData, setFormData] = useState({
    date: '2026-01-04',
    type: 'income',
    category: 'Offertory',
    subcategory: 'Sunday Offertory',
    amount: 1850,
    remarks: 'First Sunday offertory — January',
    recorded_by: 'Treasurer'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Form Data:', formData);
  };

  const handleCancel = () => {
    console.log('Form cleared');
  };

  return (
    <div className="expense-container">
      <div className="expense-card">
        
        {/* Header Section */}
        <div className="expense-header">
          <div>
            <h1 className="expense-title">Transaction Recorder</h1>
            <p className="expense-subtitle">Create a record for an incoming transaction for the account</p>
          </div>
          <button type="button" className="btn-black btn-small">
            Transaction Details
          </button>
        </div>

        {/* Form Body */}
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
              <div className="form-group">
                <label className="field-label">Category</label>
                <div className="input-with-icon">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Offertory">Offertory</option>
                    <option value="Donation">Donation</option>
                    <option value="Tithe">Tithe</option>
                  </select>
                  <ChevronDown className="input-icon-right" size={16} />
                </div>
              </div>

              {/* Subcategory Field */}
              <div className="form-group">
                <label className="field-label">Subcategory</label>
                <div className="input-with-icon">
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Sunday Offertory">Sunday Offertory</option>
                    <option value="Special Collection">Special Collection</option>
                  </select>
                  <ChevronDown className="input-icon-right" size={16} />
                </div>
              </div>

              {/* Amount Field */}
              <div className="form-group">
                <label className="field-label">Amount</label>
                <div className="input-with-icon">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
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
            <button type="submit" className="btn-black btn-large">
              Submit
            </button>
            <button type="button" onClick={handleCancel} className="btn-black btn-large">
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Expenses;
