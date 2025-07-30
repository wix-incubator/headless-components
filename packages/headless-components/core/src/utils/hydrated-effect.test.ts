import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { extendSignalsServiceWithHydratedEffect } from "./hydrated-effect.js";

describe("extendSignalsServiceWithHydratedEffect", () => {
  let mockSignalsService: {
    effect: ReturnType<typeof vi.fn>;
    signal: ReturnType<typeof vi.fn>;
    computed: ReturnType<typeof vi.fn>;
  };
  let extendedService: ReturnType<
    typeof extendSignalsServiceWithHydratedEffect
  >;
  let mockEffectFn: ReturnType<typeof vi.fn>;
  let mockDependenciesFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock signals service with all expected methods
    mockSignalsService = {
      effect: vi.fn(),
      signal: vi.fn(),
      computed: vi.fn(),
    };

    // Mock effect function
    mockEffectFn = vi.fn();

    // Mock dependencies function
    mockDependenciesFn = vi
      .fn()
      .mockReturnValue({ searchOptions: { query: "test" } });

    // Create extended service
    extendedService =
      extendSignalsServiceWithHydratedEffect(mockSignalsService);

    // Clear any existing window mock
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset global window mock if it was modified
    if ("window" in globalThis) {
      delete (globalThis as any).window;
    }
  });

  describe("service extension", () => {
    it("should extend the signals service with hydratedEffect method", () => {
      expect(extendedService).toHaveProperty("hydratedEffect");
      expect(typeof extendedService.hydratedEffect).toBe("function");
    });

    it("should preserve all original service methods", () => {
      expect(extendedService.effect).toBe(mockSignalsService.effect);
      expect(extendedService.signal).toBe(mockSignalsService.signal);
      expect(extendedService.computed).toBe(mockSignalsService.computed);
    });
  });

  describe("client-side behavior (with window)", () => {
    beforeEach(() => {
      // Mock window object for client-side tests
      (globalThis as any).window = {};
    });

    it("should register an effect with signalsService when window is available", () => {
      extendedService.hydratedEffect(mockDependenciesFn, mockEffectFn);

      expect(mockSignalsService.effect).toHaveBeenCalledTimes(1);
      expect(mockSignalsService.effect).toHaveBeenCalledWith(
        expect.any(Function),
      );
    });

    it("should call dependencies function and skip effect on first run", async () => {
      extendedService.hydratedEffect(mockDependenciesFn, mockEffectFn);

      // Get the registered effect function
      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];
      expect(registeredEffect).toBeDefined();

      // Call the registered effect (first run)
      await registeredEffect();

      // Dependencies function should have been called to establish dependencies
      expect(mockDependenciesFn).toHaveBeenCalledTimes(1);
      // Effect function should not have been called on first run
      expect(mockEffectFn).not.toHaveBeenCalled();
    });

    it("should execute effect function on subsequent runs", async () => {
      extendedService.hydratedEffect(mockDependenciesFn, mockEffectFn);

      // Get the registered effect function
      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];
      expect(registeredEffect).toBeDefined();

      // First call (skipped)
      await registeredEffect();
      expect(mockEffectFn).not.toHaveBeenCalled();

      // Clear previous calls
      mockDependenciesFn.mockClear();

      // Second call (should execute)
      await registeredEffect();

      // Dependencies function should have been called
      expect(mockDependenciesFn).toHaveBeenCalledTimes(1);
      // Effect function should have been called with dependencies
      expect(mockEffectFn).toHaveBeenCalledTimes(1);
      expect(mockEffectFn).toHaveBeenCalledWith({
        searchOptions: { query: "test" },
      });
    });

    it("should handle async effect functions correctly", async () => {
      const asyncEffectFn = vi.fn().mockResolvedValue("async result");

      extendedService.hydratedEffect(mockDependenciesFn, asyncEffectFn);

      // Get the registered effect function
      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];

      // First call (skipped)
      await registeredEffect();
      expect(asyncEffectFn).not.toHaveBeenCalled();

      // Second call (should execute)
      await registeredEffect();
      expect(asyncEffectFn).toHaveBeenCalledTimes(1);
      expect(asyncEffectFn).toHaveBeenCalledWith({
        searchOptions: { query: "test" },
      });
    });

    it("should handle effect function errors without breaking", async () => {
      const errorEffectFn = vi
        .fn()
        .mockRejectedValue(new Error("Effect execution error"));

      extendedService.hydratedEffect(mockDependenciesFn, errorEffectFn);

      // Get the registered effect function
      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];

      // First call (skipped)
      await registeredEffect();
      expect(errorEffectFn).not.toHaveBeenCalled();

      // Second call (should throw error)
      await expect(registeredEffect()).rejects.toThrow(
        "Effect execution error",
      );
      expect(errorEffectFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("server-side behavior (without window)", () => {
    beforeEach(() => {
      // Ensure window is not defined for server-side simulation
      if ("window" in globalThis) {
        delete (globalThis as any).window;
      }
    });

    it("should not register an effect when window is not available", () => {
      extendedService.hydratedEffect(mockDependenciesFn, mockEffectFn);

      expect(mockSignalsService.effect).not.toHaveBeenCalled();
    });

    it("should not execute the effect function on server-side", () => {
      extendedService.hydratedEffect(mockDependenciesFn, mockEffectFn);

      expect(mockEffectFn).not.toHaveBeenCalled();
      expect(mockDependenciesFn).not.toHaveBeenCalled();
    });
  });

  describe("dependencies handling", () => {
    beforeEach(() => {
      (globalThis as any).window = {};
    });

    it("should pass correct dependencies to effect function", async () => {
      const customDependencies = {
        searchOptions: { query: "custom" },
        filters: { category: "test" },
      };
      const customDependenciesFn = vi.fn().mockReturnValue(customDependencies);

      extendedService.hydratedEffect(customDependenciesFn, mockEffectFn);

      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];

      // First call (skipped)
      await registeredEffect();
      expect(customDependenciesFn).toHaveBeenCalledTimes(1);
      expect(mockEffectFn).not.toHaveBeenCalled();

      // Clear previous calls
      customDependenciesFn.mockClear();

      // Second call (should execute)
      await registeredEffect();
      expect(customDependenciesFn).toHaveBeenCalledTimes(1);
      expect(mockEffectFn).toHaveBeenCalledWith(customDependencies);
    });

    it("should handle multiple effect calls with different dependencies", async () => {
      let callCount = 0;
      const dynamicDependenciesFn = vi.fn().mockImplementation(() => ({
        searchOptions: { query: `test-${++callCount}` },
      }));

      extendedService.hydratedEffect(dynamicDependenciesFn, mockEffectFn);

      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];

      // First call (skipped)
      await registeredEffect();
      expect(mockEffectFn).not.toHaveBeenCalled();

      // Second call
      await registeredEffect();
      expect(mockEffectFn).toHaveBeenCalledWith({
        searchOptions: { query: "test-2" },
      });

      // Third call
      await registeredEffect();
      expect(mockEffectFn).toHaveBeenCalledWith({
        searchOptions: { query: "test-3" },
      });
    });
  });

  describe("edge cases and robustness", () => {
    beforeEach(() => {
      (globalThis as any).window = {};
    });

    it("should work with synchronous effect functions", async () => {
      const syncEffectFn = vi.fn();

      extendedService.hydratedEffect(mockDependenciesFn, syncEffectFn);

      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];

      // First call (skipped)
      await registeredEffect();
      expect(syncEffectFn).not.toHaveBeenCalled();

      // Second call (should execute)
      await registeredEffect();
      expect(syncEffectFn).toHaveBeenCalledTimes(1);
    });

    it("should handle window being undefined after registration", async () => {
      extendedService.hydratedEffect(mockDependenciesFn, mockEffectFn);

      // Remove window after effect is registered (edge case)
      delete (globalThis as any).window;

      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];

      // Effect should still work since it was registered when window existed
      await registeredEffect();
      await registeredEffect(); // Second call should execute
      expect(mockEffectFn).toHaveBeenCalledTimes(1);
    });
  });
});
