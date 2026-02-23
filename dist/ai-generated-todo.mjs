import { ref as h, computed as _, defineComponent as K, resolveComponent as x, openBlock as d, createElementBlock as v, createElementVNode as s, toDisplayString as k, createCommentVNode as S, createVNode as B, withKeys as E, createBlock as V, withCtx as O, Fragment as $, renderList as z, normalizeClass as M, createApp as F } from "vue";
import { defineStore as J, createPinia as P } from "pinia";
import Y, { ElMessageBox as G } from "element-plus";
const D = "ai_generated_todo_items";
function L() {
  try {
    const e = localStorage.getItem(D);
    if (!e) return [];
    const t = JSON.parse(e);
    return Array.isArray(t) ? t.map((n) => ({
      id: String(n.id),
      text: String(n.text ?? ""),
      done: !!n.done,
      createdAt: Number(n.createdAt ?? Date.now())
    })) : [];
  } catch {
    return [];
  }
}
function f(e) {
  localStorage.setItem(D, JSON.stringify(e));
}
const R = J("todo", () => {
  const e = h(L()), t = _(() => e.value.filter((o) => !o.done).length), n = _(() => e.value.filter((o) => o.done).length);
  function c(o) {
    const a = o.trim();
    if (!a) return;
    const i = {
      id: typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text: a,
      done: !1,
      createdAt: Date.now()
    };
    e.value.unshift(i), f(e.value);
  }
  function r(o) {
    const a = e.value.find((i) => i.id === o);
    a && (a.done = !a.done, f(e.value));
  }
  function p(o, a) {
    const i = a.trim();
    if (!i) return;
    const g = e.value.find((T) => T.id === o);
    g && (g.text = i, f(e.value));
  }
  function y(o) {
    e.value = e.value.filter((a) => a.id !== o), f(e.value);
  }
  function C() {
    e.value = [], f(e.value);
  }
  return {
    items: e,
    pendingCount: t,
    doneCount: n,
    addTask: c,
    toggleTask: r,
    updateTask: p,
    removeTask: y,
    clearAll: C
  };
}), W = { class: "app-root" }, j = { class: "app-wrap" }, q = { class: "page-header" }, H = {
  key: 0,
  class: "counter"
}, Q = { class: "add-row" }, X = {
  key: 0,
  class: "empty-hint"
}, Z = { class: "task-list" }, ee = { class: "task-body" }, te = {
  key: 1,
  class: "task-text"
}, ne = { class: "task-actions" }, oe = ["onClick"], ae = ["onClick"], le = {
  key: 2,
  class: "page-footer"
}, se = /* @__PURE__ */ K({
  __name: "App",
  setup(e) {
    const t = R(), n = h(""), c = h(null), r = h(""), p = _(() => t.items), y = _(() => t.pendingCount), C = _(() => t.doneCount);
    function o() {
      n.value.trim() && (t.addTask(n.value), n.value = "");
    }
    function a(u) {
      c.value = u.id, r.value = u.text;
    }
    function i(u) {
      if (c.value === u) {
        if (!r.value.trim()) {
          c.value = null, r.value = "";
          return;
        }
        t.updateTask(u, r.value), c.value = null, r.value = "";
      }
    }
    function g(u) {
      t.toggleTask(u);
    }
    function T(u) {
      t.removeTask(u);
    }
    function I() {
      p.value.length && G.confirm(
        "This will permanently remove all tasks. Continue?",
        "Clear all tasks",
        {
          confirmButtonText: "Yes, clear everything",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      ).then(() => {
        t.clearAll();
      }).catch(() => {
      });
    }
    return (u, m) => {
      const A = x("el-input"), N = x("el-checkbox"), U = x("el-scrollbar");
      return d(), v("div", W, [
        s("div", j, [
          s("header", q, [
            m[2] || (m[2] = s("h1", null, "My Tasks", -1)),
            p.value.length ? (d(), v("span", H, k(y.value) + " remaining ", 1)) : S("", !0)
          ]),
          s("div", Q, [
            B(A, {
              modelValue: n.value,
              "onUpdate:modelValue": m[0] || (m[0] = (l) => n.value = l),
              placeholder: "What needs to be done?",
              onKeyup: E(o, ["enter", "native"]),
              size: "large",
              clearable: ""
            }, null, 8, ["modelValue"]),
            s("button", {
              class: "btn-add",
              onClick: o
            }, "+")
          ]),
          p.value.length ? (d(), V(U, {
            key: 1,
            class: "list-scroll"
          }, {
            default: O(() => [
              s("ul", Z, [
                (d(!0), v($, null, z(p.value, (l) => (d(), v("li", {
                  key: l.id,
                  class: M(["task-row", { "is-done": l.done }])
                }, [
                  B(N, {
                    "model-value": l.done,
                    onChange: () => g(l.id)
                  }, null, 8, ["model-value", "onChange"]),
                  s("div", ee, [
                    c.value === l.id ? (d(), V(A, {
                      key: 0,
                      modelValue: r.value,
                      "onUpdate:modelValue": m[1] || (m[1] = (b) => r.value = b),
                      size: "small",
                      onKeyup: E(() => i(l.id), ["enter", "native"]),
                      onBlur: () => i(l.id),
                      autofocus: ""
                    }, null, 8, ["modelValue", "onKeyup", "onBlur"])) : (d(), v("span", te, k(l.text), 1))
                  ]),
                  s("div", ne, [
                    s("button", {
                      class: "act-btn",
                      title: "Edit",
                      onClick: (b) => a(l)
                    }, "✎", 8, oe),
                    s("button", {
                      class: "act-btn act-btn--del",
                      title: "Delete",
                      onClick: (b) => T(l.id)
                    }, "✕", 8, ae)
                  ])
                ], 2))), 128))
              ])
            ]),
            _: 1
          })) : (d(), v("p", X, "No tasks yet — add one above.")),
          p.value.length ? (d(), v("footer", le, [
            s("span", null, k(C.value) + " / " + k(p.value.length) + " done", 1),
            s("button", {
              class: "clear-btn",
              onClick: I
            }, "Clear all")
          ])) : S("", !0)
        ])
      ]);
    };
  }
}), re = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [c, r] of t)
    n[c] = r;
  return n;
}, ue = /* @__PURE__ */ re(se, [["__scopeId", "data-v-4655747d"]]), w = F(ue);
w.use(P());
w.use(Y);
w.mount("#app");
