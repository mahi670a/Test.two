// ============================================================
// JournalMe Finance - منطق کامل
// ============================================================

function getPersianDateParts(date) {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d)) return null;
    const formatter = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const parts = formatter.formatToParts(d);
    let year = '', month = '', day = '';
    for (const p of parts) {
        if (p.type === 'year') year = p.value;
        else if (p.type === 'month') month = p.value;
        else if (p.type === 'day') day = p.value;
    }
    const map = { '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9','٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9' };
    const conv = s => s.split('').map(c => map[c] || c).join('');
    const y = parseInt(conv(year));
    const m = parseInt(conv(month));
    const dd = parseInt(conv(day));
    if (isNaN(y) || isNaN(m) || isNaN(dd)) return null;
    return { year: y, month: m, day: dd };
}

function toPersianDate(date, withTime = false) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d)) return '';
    const fmt = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: withTime ? '2-digit' : undefined, minute: withTime ? '2-digit' : undefined, hour12: false
    });
    const parts = fmt.formatToParts(d);
    let y = '', m = '', dy = '', h = '', mi = '';
    for (const p of parts) {
        if (p.type === 'year') y = p.value;
        else if (p.type === 'month') m = p.value;
        else if (p.type === 'day') dy = p.value;
        else if (p.type === 'hour') h = p.value;
        else if (p.type === 'minute') mi = p.value;
    }
    const map = { '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9','٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9' };
    const conv = s => s.split('').map(c => map[c] || c).join('');
    y = conv(y); m = conv(m); dy = conv(dy);
    return withTime ? `${y}/${m}/${dy} ${conv(h)}:${conv(mi)}` : `${y}/${m}/${dy}`;
}

function toNumber(str) {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    const map = { '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9','٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9' };
    const normalized = String(str).split('').map(c => map[c] || c).join('').replace(/,/g, '').replace(/\s/g, '');
    const n = parseFloat(normalized);
    return isNaN(n) ? 0 : n;
}

function formatMoney(num) {
    const n = parseFloat(num) || 0;
    return Math.round(n).toLocaleString('en-US');
}

function generateId() {
    return Date.now() * 1000000 + Math.floor(Math.random() * 1000000);
}

function generateUID() {
    return 'tx_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
}

function getMimeType(name) {
    if (!name || !name.includes('.')) return 'image/png';
    const ext = name.split('.').pop().toLowerCase();
    const types = { png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', gif:'image/gif', webp:'image/webp', bmp:'image/bmp', svg:'image/svg+xml', ico:'image/x-icon' };
    return types[ext] || 'image/png';
}

function escapeHTML(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

const DEFAULT_CATEGORIES = {
    income: [
        { name: 'حقوق', icon: 'fa-briefcase' },
        { name: 'فریلنس', icon: 'fa-laptop' },
        { name: 'سود بانکی', icon: 'fa-university' },
        { name: 'هدیه', icon: 'fa-gift' },
        { name: 'فروش', icon: 'fa-tag' },
        { name: 'سایر درآمد', icon: 'fa-plus' }
    ],
    expense: [
        { name: 'غذا', icon: 'fa-utensils' },
        { name: 'حمل‌ونقل', icon: 'fa-car' },
        { name: 'مسکن', icon: 'fa-home' },
        { name: 'قبض', icon: 'fa-file-invoice' },
        { name: 'خرید', icon: 'fa-shopping-bag' },
        { name: 'درمان', icon: 'fa-hospital' },
        { name: 'تفریح', icon: 'fa-gamepad' },
        { name: 'آموزش', icon: 'fa-graduation-cap' },
        { name: 'سایر هزینه', icon: 'fa-ellipsis-h' }
    ],
    investment: [
        { name: 'کریپتو', icon: 'fa-bitcoin' },
        { name: 'طلا', icon: 'fa-coins' },
        { name: 'سهام', icon: 'fa-chart-line' },
        { name: 'صندوق', icon: 'fa-chart-pie' },
        { name: 'سپرده', icon: 'fa-lock' },
        { name: 'سایر سرمایه‌گذاری', icon: 'fa-gem' }
    ]
};

const ACCOUNT_TYPES = {
    cash: { label: 'نقدی', icon: 'fa-money-bill-wave' },
    bank: { label: 'بانکی', icon: 'fa-university' },
    crypto: { label: 'کریپتو', icon: 'fa-bitcoin' },
    gold: { label: 'طلا', icon: 'fa-coins' },
    stock: { label: 'سهام', icon: 'fa-chart-line' },
    other: { label: 'سایر', icon: 'fa-wallet' }
};

class FinanceDB {
    constructor() {
        this.dbName = 'JournalMeFinance';
        this.version = 1;
        this.db = null;
        this.isReady = false;
    }

    open() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(this.dbName, this.version);
            req.onerror = () => reject(req.error);
            req.onsuccess = () => {
                this.db = req.result;
                this.isReady = true;
                console.log('✅ IndexedDB آماده است');
                resolve(this.db);
            };
            req.onupgradeneeded = (ev) => {
                const db = ev.target.result;
                if (!db.objectStoreNames.contains('transactions')) {
                    const ts = db.createObjectStore('transactions', { keyPath: 'id' });
                    ts.createIndex('uid', 'uid', { unique: true });
                    ts.createIndex('type', 'type', { unique: false });
                    ts.createIndex('date', 'date', { unique: false });
                    ts.createIndex('accountId', 'accountId', { unique: false });
                }
                if (!db.objectStoreNames.contains('accounts')) {
                    db.createObjectStore('accounts', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('categories')) {
                    const cs = db.createObjectStore('categories', { keyPath: 'id' });
                    cs.createIndex('type', 'type', { unique: false });
                }
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    }

    checkReady() {
        if (!this.isReady || !this.db) throw new Error('دیتابیس آماده نیست');
    }

    saveTransaction(tx) {
        this.checkReady();
        return new Promise((resolve, reject) => {
            let t;
            try {
                t = this.db.transaction(['transactions'], 'readwrite');
                t.objectStore('transactions').put(tx);
            } catch (e) { return reject(e); }
            t.oncomplete = () => resolve(tx.id);
            t.onerror = () => {
                const err = t.error;
                if (err && err.name === 'QuotaExceededError') reject(new Error('⚠️ فضای ذخیره‌سازی کافی نیست'));
                else reject(err);
            };
            t.onabort = () => reject(t.error || new Error('aborted'));
        });
    }

    getAllTransactions() {
        this.checkReady();
        return new Promise((resolve, reject) => {
            const t = this.db.transaction(['transactions'], 'readonly');
            const r = t.objectStore('transactions').getAll();
            r.onsuccess = () => resolve(r.result || []);
            r.onerror = () => reject(r.error);
        });
    }

    getTransactionById(id) {
        this.checkReady();
        return new Promise((resolve, reject) => {
            const t = this.db.transaction(['transactions'], 'readonly');
            const r = t.objectStore('transactions').get(parseInt(id));
            r.onsuccess = () => resolve(r.result);
            r.onerror = () => reject(r.error);
        });
    }

    deleteTransaction(id) {
        this.checkReady();
        return new Promise((resolve, reject) => {
            let t;
            try {
                t = this.db.transaction(['transactions'], 'readwrite');
                t.objectStore('transactions').delete(parseInt(id));
            } catch (e) { return reject(e); }
            t.oncomplete = () => resolve();
            t.onerror = () => reject(t.error);
            t.onabort = () => reject(t.error || new Error('aborted'));
        });
    }

    saveAccounts(arr) {
        this.checkReady();
        return new Promise((resolve, reject) => {
            let t;
            try {
                t = this.db.transaction(['accounts'], 'readwrite');
                const store = t.objectStore('accounts');
                for (const a of arr) store.put(a);
            } catch (e) { return reject(e); }
            t.oncomplete = () => resolve();
            t.onerror = () => reject(t.error);
            t.onabort = () => reject(t.error || new Error('aborted'));
        });
    }

    getAccounts() {
        this.checkReady();
        return new Promise((resolve, reject) => {
            const t = this.db.transaction(['accounts'], 'readonly');
            const r = t.objectStore('accounts').getAll();
            r.onsuccess = () => resolve(r.result || []);
            r.onerror = () => reject(r.error);
        });
    }

    deleteAccount(id) {
        this.checkReady();
        return new Promise((resolve, reject) => {
            let t;
            try {
                t = this.db.transaction(['accounts'], 'readwrite');
                t.objectStore('accounts').delete(parseInt(id));
            } catch (e) { return reject(e); }
            t.oncomplete = () => resolve();
            t.onerror = () => reject(t.error);
            t.onabort = () => reject(t.error || new Error('aborted'));
        });
    }

    saveCategories(arr) {
        this.checkReady();
        return new Promise((resolve, reject) => {
            let t;
            try {
                t = this.db.transaction(['categories'], 'readwrite');
                const store = t.objectStore('categories');
                for (const c of arr) store.put(c);
            } catch (e) { return reject(e); }
            t.oncomplete = () => resolve();
            t.onerror = () => reject(t.error);
            t.onabort = () => reject(t.error || new Error('aborted'));
        });
    }

    getCategories() {
        this.checkReady();
        return new Promise((resolve, reject) => {
            const t = this.db.transaction(['categories'], 'readonly');
            const r = t.objectStore('categories').getAll();
            r.onsuccess = () => resolve(r.result || []);
            r.onerror = () => reject(r.error);
        });
    }

    saveSetting(key, value) {
        this.checkReady();
        return new Promise((resolve, reject) => {
            let t;
            try {
                t = this.db.transaction(['settings'], 'readwrite');
                t.objectStore('settings').put({ key, value });
            } catch (e) { return reject(e); }
            t.oncomplete = () => resolve();
            t.onerror = () => reject(t.error);
            t.onabort = () => reject(t.error || new Error('aborted'));
        });
    }

    getSetting(key) {
        this.checkReady();
        return new Promise((resolve, reject) => {
            const t = this.db.transaction(['settings'], 'readonly');
            const r = t.objectStore('settings').get(key);
            r.onsuccess = () => resolve(r.result?.value);
            r.onerror = () => reject(r.error);
        });
    }

    getAllSettings() {
        this.checkReady();
        return new Promise((resolve, reject) => {
            const t = this.db.transaction(['settings'], 'readonly');
            const r = t.objectStore('settings').getAll();
            r.onsuccess = () => resolve(r.result || []);
            r.onerror = () => reject(r.error);
        });
    }

    async backup() {
        const transactions = await this.getAllTransactions();
        const accounts = await this.getAccounts();
        const categories = await this.getCategories();
        const settings = await this.getAllSettings();
        return { transactions, accounts, categories, settings, exportDate: new Date().toISOString(), version: '1.0' };
    }

    clearAll() {
        this.checkReady();
        const clear = (name) => new Promise((resolve, reject) => {
            const t = this.db.transaction([name], 'readwrite');
            t.objectStore(name).clear();
            t.oncomplete = () => resolve();
            t.onerror = () => reject(t.error);
            t.onabort = () => reject(t.error || new Error('aborted'));
        });
        return Promise.all([clear('transactions'), clear('accounts'), clear('categories'), clear('settings')]);
    }
}

const db = new FinanceDB();

let transactions = [];
let accounts = [];
let categories = [];
let currency = 'تومان';
let currentType = 'expense';
let editingTransactionId = null;
let currentAttachmentData = null;
let trendChart = null;
let incomeExpenseChart = null;
let categoryChart = null;
let isImportCancelled = false;
let currentCategoryType = 'expense';

function formatCurrency(num) {
    return formatMoney(num) + ' ' + currency;
}

function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active-section'));
    const target = document.getElementById(sectionId + '-section');
    if (target) target.classList.add('active-section');
    document.querySelectorAll('.toolbar-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.toolbar-btn[data-section="${sectionId}"]`);
    if (btn) btn.classList.add('active');

    if (sectionId === 'dashboard') updateDashboard();
    if (sectionId === 'history') loadTransactions();
    if (sectionId === 'analysis') updateAnalysis();
    if (sectionId === 'accounts') renderAccounts();
    if (sectionId === 'categories') renderCategories();
}

async function initialize() {
    try {
        await db.open();
        await loadSettings();
        await loadAccounts();
        await loadCategories();
        await loadTransactionsFromDB();

        if (accounts.length === 0) await createDefaultAccount();
        if (categories.length === 0) await createDefaultCategories();

        await refreshAllSelects();
        updateDashboard();
        updateAccountsCount();
        setDefaultDate();
        console.log('✅ راه‌اندازی کامل شد');
    } catch (e) {
        console.error('❌ خطای راه‌اندازی:', e);
        showNotification('خطا در راه‌اندازی: ' + e.message, 'error');
    }
}

async function loadSettings() {
    const c = await db.getSetting('currency');
    if (c) currency = c;
}

async function loadAccounts() {
    accounts = await db.getAccounts();
}

async function loadCategories() {
    categories = await db.getCategories();
}

async function loadTransactionsFromDB() {
    transactions = await db.getAllTransactions();
}

async function createDefaultAccount() {
    const acc = {
        id: generateId(),
        name: 'نقدی',
        type: 'cash',
        initialBalance: 0,
        isActive: true,
        createdAt: new Date().toISOString()
    };
    accounts = [acc];
    await db.saveAccounts(accounts);
}

async function createDefaultCategories() {
    const all = [];
    for (const [type, list] of Object.entries(DEFAULT_CATEGORIES)) {
        for (const c of list) {
            all.push({ id: generateId(), name: c.name, type, icon: c.icon, isPreset: true });
        }
    }
    categories = all;
    await db.saveCategories(categories);
}

async function refreshAllSelects() {
    refreshAccountSelects();
    refreshCategorySelect();
    refreshHistoryFilters();
}

function refreshAccountSelects() {
    const fromSel = document.getElementById('accountId');
    const toSel = document.getElementById('toAccountId');
    const histAcc = document.getElementById('histAccount');

    const opts = accounts.map(a => `<option value="${a.id}">${escapeHTML(a.name)}</option>`).join('');
    if (fromSel) fromSel.innerHTML = opts || '<option value="">حسابی موجود نیست</option>';
    if (toSel) toSel.innerHTML = opts || '<option value="">حسابی موجود نیست</option>';
    if (histAcc) histAcc.innerHTML = '<option value="all">همه حساب‌ها</option>' + opts;
}

function refreshCategorySelect() {
    const sel = document.getElementById('categoryId');
    if (!sel) return;
    if (currentType === 'transfer') {
        sel.innerHTML = '<option value="">بدون دسته</option>';
        return;
    }
    const filtered = categories.filter(c => c.type === currentType);
    sel.innerHTML = '<option value="">انتخاب دسته...</option>' + filtered.map(c => `<option value="${c.id}">${escapeHTML(c.name)}</option>`).join('');
}

function refreshHistoryFilters() {
    const sel = document.getElementById('histCategory');
    if (!sel) return;
    const opts = categories.map(c => `<option value="${c.id}">${escapeHTML(c.name)}</option>`).join('');
    sel.innerHTML = '<option value="all">همه دسته‌ها</option>' + opts;
}

function setDefaultDate() {
    const now = new Date();
    const off = now.getTimezoneOffset() * 60000;
    const localISO = new Date(now - off).toISOString().slice(0, 16);
    const dateEl = document.getElementById('date');
    if (dateEl) dateEl.value = localISO;
}

function selectType(type) {
    currentType = type;
    document.getElementById('type').value = type;
    document.querySelectorAll('.type-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.type === type);
    });
    document.getElementById('toAccountGroup').style.display = type === 'transfer' ? '' : 'none';
    document.getElementById('categoryGroup').style.display = type === 'transfer' ? 'none' : '';
    refreshCategorySelect();
}

function previewAttachment(input) {
    if (!input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        compressImage(e.target.result, (data) => {
            currentAttachmentData = data;
            const preview = document.getElementById('attachmentPreview');
            preview.src = data;
            document.getElementById('attachmentPreviewContainer').classList.add('active');
        });
    };
    reader.readAsDataURL(input.files[0]);
}

function removeAttachment() {
    const f = document.getElementById('attachmentFile');
    if (f) f.value = '';
    const p = document.getElementById('attachmentPreview');
    if (p) p.src = '';
    const c = document.getElementById('attachmentPreviewContainer');
    if (c) c.classList.remove('active');
    currentAttachmentData = null;
}

function compressImage(dataUrl, cb) {
    const img = new Image();
    img.onload = () => {
        const max = 1200;
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * s);
        canvas.height = Math.round(img.height * s);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        cb(canvas.toDataURL('image/jpeg', 0.78));
    };
    img.onerror = () => cb(dataUrl);
    img.src = dataUrl;
}

document.getElementById('transactionForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const amountStr = document.getElementById('amount').value.trim();
    const amount = toNumber(amountStr);
    if (amount <= 0) { showNotification('مبلغ معتبر وارد کنید.', 'error'); return; }

    const date = document.getElementById('date').value;
    if (!date) { showNotification('تاریخ را وارد کنید.', 'error'); return; }

    const accountId = document.getElementById('accountId').value;
    if (!accountId) { showNotification('حساب را انتخاب کنید.', 'error'); return; }

    const type = document.getElementById('type').value;
    let categoryId = document.getElementById('categoryId').value || null;
    let toAccountId = null;

    if (type === 'transfer') {
        toAccountId = document.getElementById('toAccountId').value;
        if (!toAccountId) { showNotification('حساب مقصد را انتخاب کنید.', 'error'); return; }
        if (parseInt(toAccountId) === parseInt(accountId)) { showNotification('حساب مبدأ و مقصد یکی نباشد.', 'error'); return; }
        categoryId = null;
    }

    const tx = {
        id: editingTransactionId != null ? editingTransactionId : generateId(),
        uid: editingTransactionId != null ? (await db.getTransactionById(editingTransactionId))?.uid : generateUID(),
        type,
        amount,
        currency,
        date,
        accountId: parseInt(accountId),
        toAccountId: toAccountId ? parseInt(toAccountId) : null,
        categoryId: categoryId ? parseInt(categoryId) : null,
        description: document.getElementById('description').value.trim(),
        notes: document.getElementById('notes').value.trim(),
        attachment: currentAttachmentData,
        attachmentName: currentAttachmentData ? `receipt_${Date.now()}.jpg` : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    if (editingTransactionId != null) {
        const orig = await db.getTransactionById(editingTransactionId);
        if (orig) {
            tx.createdAt = orig.createdAt;
            if (!tx.attachment) {
                tx.attachment = orig.attachment;
                tx.attachmentName = orig.attachmentName;
            }
        }
    }

    try {
        await db.saveTransaction(tx);
        editingTransactionId = null;
        currentAttachmentData = null;

        await loadTransactionsFromDB();
        await refreshAllSelects();
        updateDashboard();
        updateAccountsCount();

        this.reset();
        document.getElementById('type').value = 'expense';
        currentType = 'expense';
        document.querySelectorAll('.type-btn').forEach(b => b.classList.toggle('active', b.dataset.type === 'expense'));
        document.getElementById('toAccountGroup').style.display = 'none';
        document.getElementById('categoryGroup').style.display = '';
        refreshCategorySelect();
        removeAttachment();
        setDefaultDate();

        showNotification('✅ تراکنش ثبت شد', 'success');
        await checkStorage();
        setTimeout(() => switchSection('dashboard'), 800);
    } catch (err) {
        console.error(err);
        showNotification('خطا در ذخیره: ' + err.message, 'error');
    }
});

document.getElementById('transactionForm').addEventListener('reset', () => {
    editingTransactionId = null;
    currentAttachmentData = null;
    setTimeout(() => {
        removeAttachment();
        selectType('expense');
    }, 0);
});

function updateDashboard() {
    const totalBalance = accounts.reduce((sum, acc) => sum + getAccountBalance(acc.id), 0);
    document.getElementById('totalBalance').textContent = formatCurrency(totalBalance);

    const now = new Date();
    const pd = getPersianDateParts(now);
    const monthly = transactions.filter(t => {
        const d = getPersianDateParts(t.date);
        return d && d.year === pd.year && d.month === pd.month;
    });

    const income = monthly.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = monthly.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const investment = monthly.filter(t => t.type === 'investment').reduce((s, t) => s + t.amount, 0);
    const netSaving = income - expense - investment;

    document.getElementById('monthlyIncome').textContent = formatMoney(income);
    document.getElementById('monthlyExpense').textContent = formatMoney(expense);
    document.getElementById('monthlyInvestment').textContent = formatMoney(investment);
    const netEl = document.getElementById('monthlyNetSaving');
    netEl.textContent = (netSaving >= 0 ? '+' : '') + formatMoney(Math.abs(netSaving));
    netEl.className = 'stat-value ' + (netSaving >= 0 ? 'positive' : 'negative');

    updateTrendChart();
    renderTopExpenseCategories(monthly);
}

function getAccountBalance(accountId) {
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return 0;
    let balance = acc.initialBalance || 0;
    for (const t of transactions) {
        if (t.type === 'income' && t.accountId === accountId) balance += t.amount;
        else if (t.type === 'expense' && t.accountId === accountId) balance -= t.amount;
        else if (t.type === 'investment' && t.accountId === accountId) balance -= t.amount;
        else if (t.type === 'transfer') {
            if (t.accountId === accountId) balance -= t.amount;
            if (t.toAccountId === accountId) balance += t.amount;
        }
    }
    return balance;
}

function updateTrendChart() {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(getPersianDateParts(d));
    }

    const incomeData = [];
    const expenseData = [];

    for (const m of months) {
        const mTx = transactions.filter(t => {
            const d = getPersianDateParts(t.date);
            return d && d.year === m.year && d.month === m.month;
        });
        incomeData.push(mTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0));
        expenseData.push(mTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
    }

    const monthNames = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
    const labels = months.map(m => monthNames[m.month - 1]);

    if (trendChart) trendChart.destroy();
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: 'درآمد', data: incomeData, borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,0.1)', borderWidth: 3, tension: 0.3, fill: true },
                { label: 'هزینه', data: expenseData, borderColor: '#fb7185', backgroundColor: 'rgba(251,113,133,0.1)', borderWidth: 3, tension: 0.3, fill: true }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#e8edf6', font: { family: 'Vazirmatn' } } },
                tooltip: { backgroundColor: '#17223a', titleColor: '#f1f5f9', bodyColor: '#94a3b8', borderColor: '#243049', borderWidth: 1 }
            },
            scales: {
                x: { grid: { color: 'rgba(71,85,105,0.2)' }, ticks: { color: '#8c9bb5', font: { family: 'Vazirmatn' } } },
                y: { grid: { color: 'rgba(71,85,105,0.2)' }, ticks: { color: '#8c9bb5', font: { family: 'Vazirmatn' } } }
            }
        }
    });
}

function renderTopExpenseCategories(monthlyTxs) {
    const el = document.getElementById('topExpenseCategories');
    if (!el) return;
    const expenses = monthlyTxs.filter(t => t.type === 'expense' && t.categoryId);
    const byCat = {};
    for (const t of expenses) {
        const cat = categories.find(c => c.id === t.categoryId);
        const key = cat ? cat.name : 'نامشخص';
        byCat[key] = (byCat[key] || 0) + t.amount;
    }
    const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (sorted.length === 0) {
        el.innerHTML = '<p style="color:var(--muted);text-align:center;padding:20px;">هزینه‌ای در این ماه ثبت نشده</p>';
        return;
    }
    const max = sorted[0][1];
    el.innerHTML = sorted.map(([name, amount]) => {
        const pct = (amount / max) * 100;
        return `<div class="top-list-item">
            <div class="top-list-name">
                <strong>${escapeHTML(name)}</strong>
                <div class="top-list-bar" style="width:${pct}%"></div>
            </div>
            <div class="top-list-amount">${formatMoney(amount)}</div>
        </div>`;
    }).join('');
}

function updateAccountsCount() {
    const active = accounts.filter(a => a.isActive !== false).length;
    const el = document.getElementById('activeAccountCount');
    if (el) el.textContent = active + ' حساب فعال';
}

function loadTransactions() {
    const tbody = document.getElementById('transactionsTableBody');
    const noMsg = document.getElementById('noTransactionsMessage');
    if (!tbody) return;

    const filtered = applyHistoryFilters();
    const countEl = document.getElementById('histCount');
    if (countEl) countEl.textContent = `${filtered.length} از ${transactions.length} تراکنش`;

    if (filtered.length === 0) {
        tbody.innerHTML = '';
        if (noMsg) noMsg.style.display = 'block';
        return;
    }
    if (noMsg) noMsg.style.display = 'none';

    const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = sorted.map(t => {
        const typeLabels = { income: 'درآمد', expense: 'هزینه', investment: 'سرمایه‌گذاری', transfer: 'انتقال' };
        const typeCls = { income: 'chip-income', expense: 'chip-expense', investment: 'chip-investment', transfer: 'chip-transfer' };
        const amountCls = { income: 'amount-income', expense: 'amount-expense', investment: 'amount-investment', transfer: 'amount-transfer' };
        const rowCls = { income: 'row-income', expense: 'row-expense', investment: 'row-investment', transfer: 'row-transfer' };
        const sign = (t.type === 'income') ? '+' : '−';

        const cat = t.categoryId ? categories.find(c => c.id === t.categoryId) : null;
        const acc = accounts.find(a => a.id === t.accountId);
        const toAcc = t.toAccountId ? accounts.find(a => a.id === t.toAccountId) : null;

        let accountLabel = acc ? escapeHTML(acc.name) : '-';
        if (t.type === 'transfer' && toAcc) accountLabel = `${escapeHTML(acc?.name || '')} ← ${escapeHTML(toAcc.name)}`;

        return `<tr class="${rowCls[t.type]}">
            <td data-label="تاریخ">${toPersianDate(t.date)}</td>
            <td data-label="نوع"><span class="chip ${typeCls[t.type]}">${typeLabels[t.type]}</span></td>
            <td data-label="دسته">${cat ? escapeHTML(cat.name) : '-'}</td>
            <td data-label="حساب">${accountLabel}</td>
            <td data-label="مبلغ"><span class="amount-cell ${amountCls[t.type]}">${sign}${formatMoney(t.amount)}</span></td>
            <td data-label="توضیح">${escapeHTML(t.description || '-')}</td>
            <td class="actions">
                <button class="btn-icon view" onclick="showDetails(${t.id})" title="جزئیات"><i class="fas fa-eye"></i></button>
                <button class="btn-icon edit" onclick="editTransaction(${t.id})" title="ویرایش"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete" onclick="deleteTransaction(${t.id})" title="حذف"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
    }).join('');
}

function applyHistoryFilters() {
    const q = (document.getElementById('histSearch')?.value || '').trim().toLowerCase();
    const type = document.getElementById('histType')?.value || 'all';
    const account = document.getElementById('histAccount')?.value || 'all';
    const category = document.getElementById('histCategory')?.value || 'all';

    return transactions.filter(t => {
        if (q && !`${t.description} ${t.notes}`.toLowerCase().includes(q)) return false;
        if (type !== 'all' && t.type !== type) return false;
        if (account !== 'all' && t.accountId !== parseInt(account) && t.toAccountId !== parseInt(account)) return false;
        if (category !== 'all' && t.categoryId !== parseInt(category)) return false;
        return true;
    });
}

function showDetails(id) {
    const t = transactions.find(x => x.id === id);
    if (!t) return;

    const typeLabels = { income: 'درآمد', expense: 'هزینه', investment: 'سرمایه‌گذاری', transfer: 'انتقال' };
    document.getElementById('detail-type').textContent = typeLabels[t.type];
    document.getElementById('detail-amount').textContent = formatMoney(t.amount) + ' ' + currency;
    document.getElementById('detail-date').textContent = toPersianDate(t.date, true);
    const acc = accounts.find(a => a.id === t.accountId);
    document.getElementById('detail-account').textContent = acc ? acc.name : '-';
    const cat = t.categoryId ? categories.find(c => c.id === t.categoryId) : null;
    document.getElementById('detail-category').textContent = cat ? cat.name : '-';

    const toWrap = document.getElementById('detail-to-account-wrap');
    if (t.type === 'transfer' && t.toAccountId) {
        const toAcc = accounts.find(a => a.id === t.toAccountId);
        document.getElementById('detail-to-account').textContent = toAcc ? toAcc.name : '-';
        toWrap.style.display = '';
    } else {
        toWrap.style.display = 'none';
    }

    const descSec = document.getElementById('detail-description-section');
    if (t.description) { document.getElementById('detail-description').textContent = t.description; descSec.style.display = ''; }
    else descSec.style.display = 'none';

    const notesSec = document.getElementById('detail-notes-section');
    if (t.notes) { document.getElementById('detail-notes').textContent = t.notes; notesSec.style.display = ''; }
    else notesSec.style.display = 'none';

    const attSec = document.getElementById('detail-attachment-section');
    if (t.attachment) {
        document.getElementById('detail-attachment').src = t.attachment;
        attSec.style.display = '';
    } else attSec.style.display = 'none';

    document.getElementById('detailsModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeDetailsModal() {
    document.getElementById('detailsModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openImageModal(src) {
    if (!src) return;
    document.getElementById('fullSizeImage').src = src;
    document.getElementById('imageModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

async function editTransaction(id) {
    const t = await db.getTransactionById(id);
    if (!t) return;

    editingTransactionId = id;
    selectType(t.type);
    document.getElementById('amount').value = t.amount;
    document.getElementById('date').value = t.date.slice(0, 16);
    document.getElementById('accountId').value = t.accountId;
    if (t.toAccountId) document.getElementById('toAccountId').value = t.toAccountId;
    if (t.categoryId) document.getElementById('categoryId').value = t.categoryId;
    document.getElementById('description').value = t.description || '';
    document.getElementById('notes').value = t.notes || '';
    if (t.attachment) {
        currentAttachmentData = t.attachment;
        document.getElementById('attachmentPreview').src = t.attachment;
        document.getElementById('attachmentPreviewContainer').classList.add('active');
    } else {
        removeAttachment();
    }

    switchSection('transaction-form');
    showNotification('در حال ویرایش...', 'info');
}

async function deleteTransaction(id) {
    if (!confirm('از حذف این تراکنش اطمینان دارید؟')) return;
    try {
        await db.deleteTransaction(id);
        await loadTransactionsFromDB();
        loadTransactions();
        updateDashboard();
        updateAccountsCount();
        showNotification('حذف شد', 'warning');
    } catch (e) {
        showNotification('خطا در حذف: ' + e.message, 'error');
    }
}

function updateAnalysis() {
    const range = parseInt(document.getElementById('analysisRange')?.value || 6);
    const now = new Date();
    const months = [];
    for (let i = range - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(getPersianDateParts(d));
    }

    const incomeData = [];
    const expenseData = [];
    for (const m of months) {
        const mTx = transactions.filter(t => {
            const d = getPersianDateParts(t.date);
            return d && d.year === m.year && d.month === m.month;
        });
        incomeData.push(mTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0));
        expenseData.push(mTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
    }

    const monthNames = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
    const labels = months.map(m => monthNames[m.month - 1]);

    const lineCanvas = document.getElementById('incomeExpenseChart');
    if (lineCanvas) {
        const ctx = lineCanvas.getContext('2d');
        if (incomeExpenseChart) incomeExpenseChart.destroy();
        incomeExpenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    { label: 'درآمد', data: incomeData, backgroundColor: 'rgba(52,211,153,0.7)', borderColor: '#34d399', borderWidth: 1 },
                    { label: 'هزینه', data: expenseData, backgroundColor: 'rgba(251,113,133,0.7)', borderColor: '#fb7185', borderWidth: 1 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#e8edf6', font: { family: 'Vazirmatn' } } },
                    tooltip: { backgroundColor: '#17223a', titleColor: '#f1f5f9', bodyColor: '#94a3b8' }
                },
                scales: {
                    x: { grid: { color: 'rgba(71,85,105,0.2)' }, ticks: { color: '#8c9bb5', font: { family: 'Vazirmatn' } } },
                    y: { grid: { color: 'rgba(71,85,105,0.2)' }, ticks: { color: '#8c9bb5', font: { family: 'Vazirmatn' } } }
                }
            }
        });
    }

    const pieCanvas = document.getElementById('categoryChart');
    if (pieCanvas) {
        const ctx = pieCanvas.getContext('2d');
        const byCat = {};
        for (const t of transactions.filter(t => t.type === 'expense')) {
            const cat = categories.find(c => c.id === t.categoryId);
            const key = cat ? cat.name : 'نامشخص';
            byCat[key] = (byCat[key] || 0) + t.amount;
        }
        const entries = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 8);
        const colors = ['#7aa2ff','#a78bfa','#34d399','#f5b84b','#fb7185','#60a5fa','#c084fc','#8c9bb5'];

        if (categoryChart) categoryChart.destroy();
        categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: entries.map(e => e[0]),
                datasets: [{ data: entries.map(e => e[1]), backgroundColor: colors, borderColor: '#111a2c', borderWidth: 2 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#e8edf6', font: { family: 'Vazirmatn' } } },
                    tooltip: { backgroundColor: '#17223a', titleColor: '#f1f5f9', bodyColor: '#94a3b8' }
                }
            }
        });
    }

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const totalInvestment = transactions.filter(t => t.type === 'investment').reduce((s, t) => s + t.amount, 0);

    document.getElementById('totalIncomeAll').textContent = formatMoney(totalIncome);
    document.getElementById('totalExpenseAll').textContent = formatMoney(totalExpense);
    document.getElementById('totalInvestmentAll').textContent = formatMoney(totalInvestment);
    document.getElementById('totalTransactionsCount').textContent = transactions.length;

    if (transactions.length > 0) {
        const dates = transactions.map(t => new Date(t.date).getTime()).filter(d => !isNaN(d));
        if (dates.length > 0) {
            const minDate = Math.min(...dates);
            const days = Math.max(1, Math.ceil((Date.now() - minDate) / 86400000));
            document.getElementById('avgDailyExpense').textContent = formatMoney(totalExpense / days);
        } else {
            document.getElementById('avgDailyExpense').textContent = '0';
        }
    } else {
        document.getElementById('avgDailyExpense').textContent = '0';
    }

    const maxExp = transactions.filter(t => t.type === 'expense').reduce((m, t) => Math.max(m, t.amount), 0);
    document.getElementById('maxExpense').textContent = formatMoney(maxExp);
}

function renderAccounts() {
    const el = document.getElementById('accountsList');
    if (!el) return;

    if (accounts.length === 0) {
        el.innerHTML = '<p style="color:var(--muted);text-align:center;padding:30px;">حسابی وجود ندارد. یکی اضافه کنید.</p>';
        return;
    }

    el.innerHTML = accounts.map(acc => {
        const balance = getAccountBalance(acc.id);
        const typeInfo = ACCOUNT_TYPES[acc.type] || ACCOUNT_TYPES.other;
        return `<div class="account-card">
            <div class="account-card-info">
                <div class="account-card-icon" data-type="${acc.type}"><i class="fas ${typeInfo.icon}"></i></div>
                <div>
                    <div class="account-card-name">${escapeHTML(acc.name)}</div>
                    <div class="account-card-type">${typeInfo.label}</div>
                </div>
            </div>
            <div class="account-card-balance">${formatMoney(balance)} ${currency}</div>
            <div class="account-card-actions">
                <button class="btn-icon delete" onclick="deleteAccountConfirm(${acc.id})" title="حذف"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
}

async function addAccount() {
    const name = document.getElementById('newAccountName').value.trim();
    const type = document.getElementById('newAccountType').value;
    const initial = toNumber(document.getElementById('newAccountInitial').value);

    if (!name) { showNotification('نام حساب را وارد کنید.', 'error'); return; }
    if (accounts.some(a => a.name.toLowerCase() === name.toLowerCase())) {
        showNotification('این نام قبلاً استفاده شده.', 'error');
        return;
    }

    const acc = {
        id: generateId(),
        name,
        type,
        initialBalance: initial,
        isActive: true,
        createdAt: new Date().toISOString()
    };
    accounts.push(acc);
    await db.saveAccounts(accounts);

    document.getElementById('newAccountName').value = '';
    document.getElementById('newAccountInitial').value = '';

    renderAccounts();
    refreshAllSelects();
    updateAccountsCount();
    showNotification('✅ حساب اضافه شد', 'success');
}

async function deleteAccountConfirm(id) {
    if (accounts.length <= 1) { showNotification('حداقل یک حساب باید باشد.', 'error'); return; }
    const hasTx = transactions.some(t => t.accountId === id || t.toAccountId === id);
    if (hasTx) { showNotification('این حساب تراکنش دارد و قابل حذف نیست.', 'error'); return; }
    if (!confirm('این حساب حذف شود؟')) return;

    await db.deleteAccount(id);
    accounts = accounts.filter(a => a.id !== id);
    await db.saveAccounts(accounts);
    renderAccounts();
    refreshAllSelects();
    updateAccountsCount();
    showNotification('حساب حذف شد.', 'warning');
}

// ===== مدیریت دسته‌ها =====
function selectCategoryType(type) {
    currentCategoryType = type;
    document.querySelectorAll('[data-cat-type]').forEach(b => {
        b.classList.toggle('active', b.dataset.catType === type);
    });
    renderCategories();
}

function renderCategories() {
    const el = document.getElementById('categoriesList');
    if (!el) return;

    const filtered = categories.filter(c => c.type === currentCategoryType);

    if (filtered.length === 0) {
        el.innerHTML = '<p style="color:var(--muted);text-align:center;padding:30px;">دسته‌ای در این بخش وجود ندارد.</p>';
        return;
    }

    const typeLabels = { income: 'درآمد', expense: 'هزینه', investment: 'سرمایه‌گذاری' };

    el.innerHTML = filtered.map(cat => {
        const usedCount = transactions.filter(t => t.categoryId === cat.id).length;
        return `<div class="account-card">
            <div class="account-card-info">
                <div class="account-card-icon" data-type="${cat.type === 'income' ? 'cash' : (cat.type === 'investment' ? 'crypto' : 'bank')}">
                    <i class="fas ${escapeHTML(cat.icon || 'fa-tag')}"></i>
                </div>
                <div>
                    <div class="account-card-name">${escapeHTML(cat.name)}</div>
                    <div class="account-card-type">${typeLabels[cat.type]} ${usedCount > 0 ? `· ${usedCount} استفاده` : ''}</div>
                </div>
            </div>
            <div class="account-card-actions">
                <button class="btn-icon delete" onclick="deleteCategoryConfirm(${cat.id})" title="حذف"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
}

async function addCategory() {
    const name = document.getElementById('newCategoryName').value.trim();
    let icon = (document.getElementById('newCategoryIcon').value.trim() || 'fa-tag');
    if (!icon.startsWith('fa-')) icon = 'fa-' + icon;

    if (!name) { showNotification('نام دسته را وارد کنید.', 'error'); return; }
    if (categories.some(c => c.type === currentCategoryType && c.name.toLowerCase() === name.toLowerCase())) {
        showNotification('این دسته در این بخش وجود دارد.', 'error');
        return;
    }

    const cat = {
        id: generateId(),
        name,
        type: currentCategoryType,
        icon,
        isPreset: false
    };

    categories.push(cat);
    await db.saveCategories(categories);

    document.getElementById('newCategoryName').value = '';
    document.getElementById('newCategoryIcon').value = 'fa-tag';

    renderCategories();
    refreshCategorySelect();
    refreshHistoryFilters();
    showNotification('✅ دسته اضافه شد', 'success');
}

async function deleteCategoryConfirm(id) {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;

    const usedCount = transactions.filter(t => t.categoryId === id).length;
    if (usedCount > 0) {
        showNotification(`این دسته در ${usedCount} تراکنش استفاده شده و قابل حذف نیست.`, 'error');
        return;
    }

    if (!confirm(`دسته «${cat.name}» حذف شود؟`)) return;

    categories = categories.filter(c => c.id !== id);
    await db.saveCategories(categories);

    renderCategories();
    refreshCategorySelect();
    refreshHistoryFilters();
    showNotification('دسته حذف شد.', 'warning');
}

async function exportData() {
    try {
        showProgress('آماده‌سازی...', 10);
        const backupData = await db.backup();
        showProgress('ایجاد ZIP...', 30);
        const zip = new JSZip();

        const exportTxs = backupData.transactions.map(t => ({
            ...t,
            attachment: t.attachmentName || null
        }));

        zip.file('data.json', JSON.stringify({ ...backupData, transactions: exportTxs }, null, 2));
        showProgress('پردازش تصاویر...', 50);
        const imgFolder = zip.folder('images');

        let count = 0, processed = 0;
        backupData.transactions.forEach(t => { if (t.attachment) count++; });

        for (const t of backupData.transactions) {
            if (isImportCancelled) { showNotification('لغو شد', 'warning'); hideProgress(); return; }
            if (t.attachment && t.attachmentName) {
                imgFolder.file(t.attachmentName, t.attachment.split(',')[1], { base64: true });
                processed++;
                showProgress(`تصویر ${processed}/${count}...`, 50 + Math.floor((processed / Math.max(1, count)) * 40));
            }
        }

        showProgress('نهایی‌سازی...', 90);
        const now = new Date();
        const pd = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(now).replace(/\//g, '-');
        const fileName = `finance-backup-${pd}.zip`;
        const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
        showProgress('دانلود...', 100);

        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 30000);
        setTimeout(hideProgress, 1500);
        showNotification('✅ دانلود شد', 'success');
    } catch (e) {
        console.error(e);
        hideProgress();
        showNotification('خطا: ' + e.message, 'error');
    } finally {
        isImportCancelled = false;
    }
}

async function importData() {
    const fileInput = document.getElementById('backupFile');
    const file = fileInput.files[0];
    if (!file) { showNotification('فایل ZIP انتخاب کنید.', 'error'); return; }
    if (!confirm('اطلاعات فعلی جایگزین می‌شود. ادامه؟')) return;

    isImportCancelled = false;
    let snapshot = null, wiped = false;
    let failedCount = 0;

    const restore = async () => {
        if (!wiped || !snapshot) return;
        try {
            await db.clearAll();
            await db.saveAccounts(snapshot.accounts || []);
            await db.saveCategories(snapshot.categories || []);
            for (const s of (snapshot.settings || [])) await db.saveSetting(s.key, s.value);
            for (const t of (snapshot.transactions || [])) await db.saveTransaction(t);
            await loadAccounts();
            await loadCategories();
            await loadTransactionsFromDB();
        } catch (e) { console.error('restore:', e); }
        wiped = false;
    };

    try {
        showProgress('خواندن ZIP...', 10);
        const zip = new JSZip();
        const zc = await zip.loadAsync(file);
        if (!zc.file('data.json')) throw new Error('data.json یافت نشد');
        showProgress('استخراج...', 20);
        const dataStr = await zc.file('data.json').async('string');
        const backupData = JSON.parse(dataStr);

        showProgress('تصاویر...', 30);
        const imagesMap = new Map();
        const imgFolder = zc.folder('images');
        let total = 0, done = 0;
        if (imgFolder) {
            imgFolder.forEach(() => total++);
            const proms = [];
            imgFolder.forEach((rel, f) => {
                if (!f.dir) {
                    proms.push(
                        f.async('base64').then(content => {
                            if (isImportCancelled) return;
                            const name = rel.split('/').pop();
                            imagesMap.set(name, `data:${getMimeType(name)};base64,${content}`);
                            done++;
                            showProgress(`تصویر ${done}/${total}`, 30 + Math.floor((done / Math.max(1, total)) * 30));
                        }).catch(err => { console.warn('skip image', rel, err); done++; })
                    );
                }
            });
            await Promise.all(proms);
            if (isImportCancelled) { showNotification('لغو شد', 'warning'); hideProgress(); return; }
        }

        showProgress('آماده‌سازی...', 65);
        snapshot = await db.backup();
        await db.clearAll();
        wiped = true;

        if (backupData.accounts) await db.saveAccounts(backupData.accounts);
        if (backupData.categories) await db.saveCategories(backupData.categories);
        if (backupData.settings) {
            for (const s of backupData.settings) {
                try { await db.saveSetting(s.key, s.value); } catch (e) {}
            }
        }

        if (backupData.transactions && Array.isArray(backupData.transactions)) {
            const batch = 20;
            const totalT = backupData.transactions.length;
            for (let i = 0; i < totalT; i += batch) {
                if (isImportCancelled) { await restore(); showNotification('لغو شد', 'warning'); hideProgress(); return; }
                const b = backupData.transactions.slice(i, i + batch);
                for (const t of b) {
                    if (!t.uid) t.uid = `tx_${t.id}`;
                    if (t.attachment) {
                        if (imagesMap.has(t.attachmentName)) {
                            t.attachment = imagesMap.get(t.attachmentName);
                        } else {
                            t.attachment = null;
                            t.attachmentName = null;
                        }
                    }
                    try { await db.saveTransaction(t); }
                    catch (e) {
                        if (e.message.includes('فضا')) { isImportCancelled = true; await restore(); hideProgress(); showNotification(e.message, 'error'); return; }
                        failedCount++;
                        console.error('skip tx', t.id, e);
                    }
                }
                showProgress(`ذخیره ${i + b.length}/${totalT}`, 70 + Math.floor((i / totalT) * 25));
                await new Promise(r => setTimeout(r, 5));
            }
        }

        await loadAccounts();
        await loadCategories();
        await loadTransactionsFromDB();
        await loadSettings();
        await refreshAllSelects();

        updateDashboard();
        updateAccountsCount();
        updateAnalysis();

        fileInput.value = '';
        setTimeout(hideProgress, 1500);
        if (failedCount > 0) {
            showNotification(`⚠️ ${failedCount} تراکنش ناموفق.`, 'warning');
        } else {
            showNotification(`✅ ${transactions.length} تراکنش بازیابی شد`, 'success');
        }
    } catch (e) {
        console.error(e);
        await restore();
        hideProgress();
        showNotification('❌ ' + (e.message || 'خطا'), 'error');
    } finally {
        isImportCancelled = false;
    }
}

function showProgress(msg, pct = 0) {
    const p = document.getElementById('backupProgress');
    if (!p) return;
    p.classList.add('active');
    const bar = document.getElementById('progressBar'); if (bar) bar.style.width = pct + '%';
    const txt = document.getElementById('progressText'); if (txt) txt.textContent = msg;
    const st = document.getElementById('progressStatus'); if (st) st.textContent = pct + '%';
    const c = document.getElementById('cancelImportBtn'); if (c) c.style.display = 'inline-block';
}

function hideProgress() {
    const p = document.getElementById('backupProgress'); if (p) p.classList.remove('active');
    const c = document.getElementById('cancelImportBtn'); if (c) c.style.display = 'none';
}

function cancelImport() { isImportCancelled = true; hideProgress(); showNotification('لغو شد', 'warning'); }

async function checkStorage() {
    if (!navigator.storage || !navigator.storage.estimate) return;
    try {
        const { usage, quota } = await navigator.storage.estimate();
        if (!quota) return;
        const ratio = usage / quota;
        if (ratio > 0.85) showNotification(`⚠️ ${(ratio*100).toFixed(0)}٪ فضا پر شده. بکاپ بگیرید.`, 'error');
        else if (ratio > 0.7) showNotification(`فضا: ${(ratio*100).toFixed(0)}٪ پر شده.`, 'warning');
    } catch (e) {}
}

function showNotification(msg, type = 'info') {
    const ex = document.querySelector('.notification'); if (ex) ex.remove();
    const n = document.createElement('div');
    n.className = 'notification';
    n.textContent = msg;
    if (type === 'success') { n.style.backgroundColor = '#10b981'; n.style.color = 'white'; }
    else if (type === 'warning') { n.style.backgroundColor = '#f59e0b'; n.style.color = '#78350f'; }
    else if (type === 'error') { n.style.backgroundColor = '#ef4444'; n.style.color = 'white'; }
    else { n.style.backgroundColor = '#3b82f6'; n.style.color = 'white'; }
    document.body.appendChild(n);
    setTimeout(() => {
        n.style.opacity = '0';
        n.style.transition = 'opacity 0.5s';
        setTimeout(() => { if (n.parentNode) n.parentNode.removeChild(n); }, 500);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    setDefaultDate();
    initialize();

    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.addEventListener('blur', function() {
            const v = toNumber(this.value);
            if (v > 0) this.value = Math.round(v);
        });
    }

    const dm = document.getElementById('detailsModal');
    if (dm) dm.addEventListener('click', e => { if (e.target === dm) closeDetailsModal(); });
    const im = document.getElementById('imageModal');
    if (im) im.addEventListener('click', e => { if (e.target === im) closeImageModal(); });
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.details-modal, .image-modal').forEach(m => {
            if (m.style.display === 'flex') {
                if (m.id === 'detailsModal') closeDetailsModal();
                else if (m.id === 'imageModal') closeImageModal();
            }
        });
    }
});
