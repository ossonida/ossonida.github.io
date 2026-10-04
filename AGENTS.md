# Repository scope

Work only in `ossonida/ossonida.github.io` for site changes. Do not edit or deploy the separate `ossonida/gah` or `ossonida/marrakesh` repositories.

GAH and Marrakesh source files remain in `gah/` and `marrakesh/`. Their public unified-site routes are `/games/gah/` and `/games/marrakesh/`. Run `node scripts/build-site.mjs` and commit the generated `games/` folders after editing the sources. Keep HOME links pointing to the unified hub. Run `node scripts/validate-site.mjs` before publishing.
