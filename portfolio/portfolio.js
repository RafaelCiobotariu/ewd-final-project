(function () {
  'use strict';

  var form         = document.getElementById('project-form');
  var tbody        = document.getElementById('projects-tbody');
  var tableEmptyMsg = document.getElementById('table-empty-msg');
  var tableWrapper = document.getElementById('table-wrapper');
  var successMsg   = document.getElementById('success-msg');

  var URL_REGEX = /^https?:\/\/.+\..+/;
  var successTimer = null;

  // ── Error helpers ──────────────────────────────────────

  function showError(id, msg) {
    var errEl = document.getElementById(id + '-error');
    var inputEl = document.getElementById(id);
    if (errEl) errEl.textContent = msg;
    if (inputEl) {
      inputEl.setAttribute('aria-invalid', 'true');
      inputEl.classList.add('input-error');
    }
  }

  function clearError(id) {
    var errEl = document.getElementById(id + '-error');
    var inputEl = document.getElementById(id);
    if (errEl) errEl.textContent = '';
    if (inputEl) {
      inputEl.removeAttribute('aria-invalid');
      inputEl.classList.remove('input-error');
    }
  }

  function clearAllErrors() {
    ['proj-name', 'proj-desc', 'proj-url', 'proj-tech', 'proj-date', 'proj-image']
      .forEach(clearError);
  }

  // ── Single-field validation ────────────────────────────

  function validateField(id) {
    var el = document.getElementById(id);
    if (!el) return true;
    var val = (el.value || '').trim();
    clearError(id);

    switch (id) {
      case 'proj-name':
        if (!val) {
          showError(id, 'Project name is required.');
          return false;
        }
        if (val.length < 3) {
          showError(id, 'Project name must be at least 3 characters.');
          return false;
        }
        break;

      case 'proj-desc':
        if (!val) {
          showError(id, 'Description is required.');
          return false;
        }
        if (val.length < 20) {
          showError(id, 'Description must be at least 20 characters (' + val.length + '/20 so far).');
          return false;
        }
        break;

      case 'proj-url':
        if (!val) {
          showError(id, 'Project URL is required.');
          return false;
        }
        if (!URL_REGEX.test(val)) {
          showError(id, 'Enter a valid URL starting with http:// or https://.');
          return false;
        }
        break;

      case 'proj-tech':
        if (!el.value) {
          showError(id, 'Please select a technology.');
          return false;
        }
        break;

      case 'proj-date':
        if (!val) {
          showError(id, 'Completion date is required.');
          return false;
        }
        var chosen = new Date(val + 'T00:00:00');
        var today  = new Date();
        today.setHours(0, 0, 0, 0);
        if (chosen > today) {
          showError(id, 'Completion date cannot be in the future.');
          return false;
        }
        break;
    }
    return true;
  }

  // ── Full form validation ───────────────────────────────

  function validateForm() {
    var fields = ['proj-name', 'proj-desc', 'proj-url', 'proj-tech', 'proj-date'];
    var valid = true;
    fields.forEach(function (id) {
      if (!validateField(id)) valid = false;
    });
    return valid;
  }

  // ── Blur / input listeners (live re-validation) ────────

  ['proj-name', 'proj-desc', 'proj-url', 'proj-tech', 'proj-date'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('blur', function () {
      var errEl = document.getElementById(id + '-error');
      if (errEl && errEl.textContent) validateField(id);
    });

    el.addEventListener('input', function () {
      var errEl = document.getElementById(id + '-error');
      if (errEl && errEl.textContent) validateField(id);
    });
  });

  // ── Success banner ─────────────────────────────────────

  function showSuccess(msg) {
    successMsg.textContent = msg;
    successMsg.classList.add('visible');
    if (successTimer) clearTimeout(successTimer);
    successTimer = setTimeout(function () {
      successMsg.classList.remove('visible');
      successMsg.textContent = '';
    }, 5000);
  }

  // ── Format date (YYYY-MM-DD → DD/MM/YYYY) ─────────────

  function formatDate(dateStr) {
    var parts = dateStr.split('-');
    return parts.length === 3 ? parts[2] + '/' + parts[1] + '/' + parts[0] : dateStr;
  }

  // ── Add a row to the table ─────────────────────────────

  function addRow(data) {
    var rowNum = tbody.rows.length + 1;
    var tr = document.createElement('tr');

    // # column
    var tdNum = document.createElement('td');
    tdNum.textContent = rowNum;
    tr.appendChild(tdNum);

    // Project Name
    var tdName = document.createElement('td');
    var strong = document.createElement('strong');
    strong.textContent = data.name;
    tdName.appendChild(strong);
    tr.appendChild(tdName);

    // Description
    var tdDesc = document.createElement('td');
    tdDesc.textContent = data.desc;
    tr.appendChild(tdDesc);

    // URL
    var tdUrl = document.createElement('td');
    var link = document.createElement('a');
    link.href = data.url;
    link.textContent = data.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Visit ' + data.name + ' (opens in new tab)');
    tdUrl.appendChild(link);
    tr.appendChild(tdUrl);

    // Technologies
    var tdTech = document.createElement('td');
    var tag = document.createElement('span');
    tag.className = 'tech-tag';
    tag.textContent = data.tech;
    tdTech.appendChild(tag);
    tr.appendChild(tdTech);

    // Thumbnail
    var tdThumb = document.createElement('td');
    if (data.imageURL) {
      var img = document.createElement('img');
      img.src = data.imageURL;
      img.alt = 'Thumbnail for ' + data.name;
      img.className = 'project-thumbnail';
      img.loading = 'lazy';
      img.width = 80;
      img.height = 60;
      tdThumb.appendChild(img);
    } else {
      var placeholder = document.createElement('span');
      placeholder.className = 'thumb-placeholder';
      placeholder.textContent = 'No image';
      tdThumb.appendChild(placeholder);
    }
    tr.appendChild(tdThumb);

    // Completion Date
    var tdDate = document.createElement('td');
    tdDate.textContent = formatDate(data.date);
    tr.appendChild(tdDate);

    // Actions
    var tdAction = document.createElement('td');
    var btnRemove = document.createElement('button');
    btnRemove.type = 'button';
    btnRemove.className = 'btn-remove';
    btnRemove.textContent = 'Remove';
    btnRemove.setAttribute('aria-label', 'Remove ' + data.name);
    btnRemove.addEventListener('click', function () {
      tr.remove();
      updateRowNumbers();
      if (tbody.rows.length === 0) {
        tableEmptyMsg.hidden = false;
        tableWrapper.hidden = true;
      }
    });
    tdAction.appendChild(btnRemove);
    tr.appendChild(tdAction);

    tbody.appendChild(tr);
  }

  function updateRowNumbers() {
    Array.prototype.forEach.call(tbody.rows, function (row, i) {
      row.cells[0].textContent = i + 1;
    });
  }

  // ── Form submit ────────────────────────────────────────

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Dismiss any previous success banner
    successMsg.classList.remove('visible');
    successMsg.textContent = '';

    if (!validateForm()) {
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var name      = document.getElementById('proj-name').value.trim();
    var desc      = document.getElementById('proj-desc').value.trim();
    var url       = document.getElementById('proj-url').value.trim();
    var tech      = document.getElementById('proj-tech').value;
    var date      = document.getElementById('proj-date').value;
    var fileInput = document.getElementById('proj-image');
    var file      = fileInput.files && fileInput.files[0];

    function doSubmit(imageURL) {
      addRow({ name: name, desc: desc, url: url, tech: tech, date: date, imageURL: imageURL });
      tableEmptyMsg.hidden = true;
      tableWrapper.hidden = false;
      form.reset();
      clearAllErrors();
      showSuccess('Project "' + name + '" added successfully!');
      document.getElementById('table-heading').scrollIntoView({ behavior: 'smooth' });
    }

    if (file) {
      var reader = new FileReader();
      reader.onload  = function (ev) { doSubmit(ev.target.result); };
      reader.onerror = function ()   { doSubmit(''); };
      reader.readAsDataURL(file);
    } else {
      doSubmit('');
    }
  });

  // ── Reset button ───────────────────────────────────────

  document.getElementById('reset-btn').addEventListener('click', function () {
    clearAllErrors();
    successMsg.classList.remove('visible');
    successMsg.textContent = '';
  });

  // ── Initial table state ────────────────────────────────

  tableEmptyMsg.hidden = false;
  tableWrapper.hidden  = true;

}());
