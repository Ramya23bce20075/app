// Show only one page at a time
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  document.getElementById(pageId).classList.add('active');
}

// Rule-based fraud detection
function detectFraud(transaction) {
  const amount = parseFloat(transaction.amount);
  const oldOrig = parseFloat(transaction.oldBalanceOrig);
  const newOrig = parseFloat(transaction.newBalanceOrig);
  const oldDest = parseFloat(transaction.oldBalanceDest);
  const newDest = parseFloat(transaction.newBalanceDest);

  if (amount > 10000) return { fraud: true, reason: "High transaction amount" };
  if (newOrig === 0 && oldOrig === amount) return { fraud: true, reason: "Sender emptied account" };
  if ((newDest - oldDest) === amount && (oldOrig - newOrig) === amount) return { fraud: true, reason: "Exact money movement detected" };
  if (newOrig < 0 || newDest < 0) return { fraud: true, reason: "Negative balance detected" };

  return { fraud: false, reason: "No suspicious activity found" };
}

// Handle form submission
document.getElementById("fraudForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const transaction = {
    amount: formData.get("amount"),
    oldBalanceOrig: formData.get("oldBalanceOrig"),
    newBalanceOrig: formData.get("newBalanceOrig"),
    oldBalanceDest: formData.get("oldBalanceDest"),
    newBalanceDest: formData.get("newBalanceDest")
  };

  const result = detectFraud(transaction);
  const resultDiv = document.getElementById("resultMessage");
  resultDiv.style.display = "block";

  if (result.fraud) {
    resultDiv.className = "result fraud";
    resultDiv.textContent = "⚠ FRAUD DETECTED: " + result.reason;
  } else {
    resultDiv.className = "result safe";
    resultDiv.textContent = "✅ NO FRAUD DETECTED";
  }

  showPage("result");
});