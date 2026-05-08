/**
 * Calculates overdue penalty for an invoice.
 * Formula: penalty = (amount * 1 * daysOverdue) / 100
 * Final amount includes penalty if overdue.
 * 
 * @param {number} amount - Original invoice amount
 * @param {Date|string} dueDate - Due date of the invoice
 * @param {string} status - Current status of the invoice
 * @returns {Object} - { daysOverdue, penaltyAmount, finalAmount }
 */
const calculateOverduePenalty = (amount, dueDate, status) => {
    if (status === "paid") {
        return {
            daysOverdue: 0,
            penaltyAmount: 0,
            finalAmount: Math.max(0, amount)
        };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    // Calculate difference in time
    const diffTime = today - due;
    
    // Calculate difference in days
    // Math.floor to ensure we only count full days past the due date
    const daysOverdue = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    if (daysOverdue <= 0) {
        return {
            daysOverdue: 0,
            penaltyAmount: 0,
            finalAmount: Math.max(0, amount)
        };
    }

    // Formula: penalty = (amount * 1% * daysOverdue)
    const penaltyAmount = (amount * 1 * daysOverdue) / 100;
    const finalAmount = amount + penaltyAmount;

    return {
        daysOverdue,
        penaltyAmount: Number(penaltyAmount.toFixed(2)),
        finalAmount: Number(finalAmount.toFixed(2))
    };
};

module.exports = { calculateOverduePenalty };
