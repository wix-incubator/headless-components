import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  hydratedEffect,
  extendSignalsServiceWithHydratedEffect,
} from "./hydrated-effect.js";

describe("hydratedEffect", () => {
  let mockSignalsService: { effect: ReturnType<typeof vi.fn> };
  let mockEffectFn: ReturnType<typeof vi.fn>;
  let firstRun: boolean;
  let getFirstRun: () => boolean;
  let setFirstRun: (value: boolean) => void;

  beforeEach(() => {
    // Mock signals service
    mockSignalsService = {
      effect: vi.fn(),
    };

    // Mock effect function
    mockEffectFn = vi.fn();

    // Initialize firstRun state management
    firstRun = true;
    getFirstRun = () => firstRun;
    setFirstRun = (value: boolean) => {
      firstRun = value;
    };

    // Clear any existing window mock
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset global window mock if it was modified
    if ("window" in globalThis) {
      delete (globalThis as any).window;
    }
  });

  describe("client-side behavior (with window)", () => {
    beforeEach(() => {
      // Mock window object for client-side tests
      (globalThis as any).window = {};
    });

    it("should register an effect with signalsService when window is available", () => {
      hydratedEffect(
        mockSignalsService,
        mockEffectFn,
        getFirstRun,
        setFirstRun,
      );

      expect(mockSignalsService.effect).toHaveBeenCalledTimes(1);
      expect(mockSignalsService.effect).toHaveBeenCalledWith(
        expect.any(Function),
      );
    });

    it("should set firstRun to false immediately", () => {
      expect(firstRun).toBe(true);

      hydratedEffect(
        mockSignalsService,
        mockEffectFn,
        getFirstRun,
        setFirstRun,
      );

      expect(firstRun).toBe(false);
    });

    it("should skip execution on first run when effect is called", async () => {
      hydratedEffect(
        mockSignalsService,
        mockEffectFn,
        getFirstRun,
        setFirstRun,
      );

      // Get the registered effect function
      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];
      expect(registeredEffect).toBeDefined();

      // Reset firstRun to true to simulate the first run condition
      firstRun = true;

      // Call the registered effect
      await registeredEffect();

      // Effect function should not have been called on first run
      expect(mockEffectFn).not.toHaveBeenCalled();
      // firstRun should be set to false after the first run
      expect(firstRun).toBe(false);
    });

    it("should execute effect function on subsequent runs", async () => {
      hydratedEffect(
        mockSignalsService,
        mockEffectFn,
        getFirstRun,
        setFirstRun,
      );

      // Get the registered effect function
      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];
      expect(registeredEffect).toBeDefined();

      // firstRun is already false from the initial hydratedEffect call
      expect(firstRun).toBe(false);

      // Call the registered effect (simulating a subsequent reactive update)
      await registeredEffect();

      // Effect function should have been called
      expect(mockEffectFn).toHaveBeenCalledTimes(1);
    });

    it("should handle async effect functions correctly", async () => {
      const asyncEffectFn = vi.fn().mockResolvedValue("async result");

      hydratedEffect(
        mockSignalsService,
        asyncEffectFn,
        getFirstRun,
        setFirstRun,
      );

      // Get the registered effect function
      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];

      // Call the registered effect (firstRun is already false)
      await registeredEffect();

      expect(asyncEffectFn).toHaveBeenCalledTimes(1);
    });

    it("should handle effect function errors without breaking", async () => {
      const errorEffectFn = vi
        .fn()
        .mockRejectedValue(new Error("Effect execution error"));

      hydratedEffect(
        mockSignalsService,
        errorEffectFn,
        getFirstRun,
        setFirstRun,
      );

      // Get the registered effect function
      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];

      // The error should propagate from the effect function
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
      hydratedEffect(
        mockSignalsService,
        mockEffectFn,
        getFirstRun,
        setFirstRun,
      );

      expect(mockSignalsService.effect).not.toHaveBeenCalled();
    });

    it("should still set firstRun to false even without window", () => {
      expect(firstRun).toBe(true);

      hydratedEffect(
        mockSignalsService,
        mockEffectFn,
        getFirstRun,
        setFirstRun,
      );

      expect(firstRun).toBe(false);
    });

    it("should not execute the effect function on server-side", () => {
      hydratedEffect(
        mockSignalsService,
        mockEffectFn,
        getFirstRun,
        setFirstRun,
      );

      expect(mockEffectFn).not.toHaveBeenCalled();
    });
  });

  describe("firstRun state management", () => {
    beforeEach(() => {
      (globalThis as any).window = {};
    });

    it("should respect custom firstRun getter and setter functions", async () => {
      let customFirstRun = true;
      const customGetFirstRun = vi.fn(() => customFirstRun);
      const customSetFirstRun = vi.fn((value: boolean) => {
        customFirstRun = value;
      });

      hydratedEffect(
        mockSignalsService,
        mockEffectFn,
        customGetFirstRun,
        customSetFirstRun,
      );

      // Should have called setFirstRun immediately during initialization
      expect(customSetFirstRun).toHaveBeenCalledWith(false);

      // Get the registered effect function
      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];

      // Reset to simulate first run scenario
      customFirstRun = true;
      customGetFirstRun.mockClear();
      customSetFirstRun.mockClear();

      // Call the registered effect
      await registeredEffect();

      // Should have checked firstRun state and updated it
      expect(customGetFirstRun).toHaveBeenCalled();
      expect(customSetFirstRun).toHaveBeenCalledWith(false);
      expect(mockEffectFn).not.toHaveBeenCalled();
    });

    it("should handle multiple effect calls with different firstRun states", async () => {
      hydratedEffect(
        mockSignalsService,
        mockEffectFn,
        getFirstRun,
        setFirstRun,
      );

      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];

      // First call - firstRun is false (already set by hydratedEffect)
      await registeredEffect();
      expect(mockEffectFn).toHaveBeenCalledTimes(1);

      // Second call - still not first run
      await registeredEffect();
      expect(mockEffectFn).toHaveBeenCalledTimes(2);

      // Manually reset firstRun to true (simulating a restart scenario)
      firstRun = true;

      // Third call - should skip because it's now "first run"
      await registeredEffect();
      expect(mockEffectFn).toHaveBeenCalledTimes(2); // Should not increment
      expect(firstRun).toBe(false); // Should be set back to false
    });
  });

  describe("edge cases and robustness", () => {
    beforeEach(() => {
      (globalThis as any).window = {};
    });

    it("should work with synchronous effect functions", async () => {
      const syncEffectFn = vi.fn();

      hydratedEffect(
        mockSignalsService,
        syncEffectFn,
        getFirstRun,
        setFirstRun,
      );

      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];

      await registeredEffect();
      expect(syncEffectFn).toHaveBeenCalledTimes(1);
    });

    it("should handle window being undefined after registration", async () => {
      hydratedEffect(
        mockSignalsService,
        mockEffectFn,
        getFirstRun,
        setFirstRun,
      );

      // Remove window after effect is registered (edge case)
      delete (globalThis as any).window;

      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];

      // Effect should still work since it was registered when window existed
      await registeredEffect();
      expect(mockEffectFn).toHaveBeenCalledTimes(1);
    });

    it("should prevent race conditions by setting firstRun to false immediately", () => {
      // Verify initial state
      expect(firstRun).toBe(true);

      // Call hydratedEffect
      hydratedEffect(
        mockSignalsService,
        mockEffectFn,
        getFirstRun,
        setFirstRun,
      );

      // firstRun should be immediately set to false to prevent race conditions
      expect(firstRun).toBe(false);
    });
  });
});

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
  let firstRun: boolean;
  let getFirstRun: () => boolean;
  let setFirstRun: (value: boolean) => void;

  beforeEach(() => {
    // Mock signals service with all expected methods
    mockSignalsService = {
      effect: vi.fn(),
      signal: vi.fn(),
      computed: vi.fn(),
    };

    // Mock effect function
    mockEffectFn = vi.fn();

    // Initialize firstRun state management
    firstRun = true;
    getFirstRun = () => firstRun;
    setFirstRun = (value: boolean) => {
      firstRun = value;
    };

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
      extendedService.hydratedEffect(mockEffectFn, getFirstRun, setFirstRun);

      expect(mockSignalsService.effect).toHaveBeenCalledTimes(1);
      expect(mockSignalsService.effect).toHaveBeenCalledWith(
        expect.any(Function),
      );
    });

    it("should set firstRun to false immediately", () => {
      expect(firstRun).toBe(true);

      extendedService.hydratedEffect(mockEffectFn, getFirstRun, setFirstRun);

      expect(firstRun).toBe(false);
    });

    it("should execute effect function on subsequent runs", async () => {
      extendedService.hydratedEffect(mockEffectFn, getFirstRun, setFirstRun);

      // Get the registered effect function
      const registeredEffect = mockSignalsService.effect.mock.calls[0]?.[0];
      expect(registeredEffect).toBeDefined();

      // firstRun is already false from the initial hydratedEffect call
      expect(firstRun).toBe(false);

      // Call the registered effect (simulating a subsequent reactive update)
      await registeredEffect();

      // Effect function should have been called
      expect(mockEffectFn).toHaveBeenCalledTimes(1);
      expect(mockEffectFn).toHaveBeenCalledWith();
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
      extendedService.hydratedEffect(mockEffectFn, getFirstRun, setFirstRun);

      expect(mockSignalsService.effect).not.toHaveBeenCalled();
    });

    it("should still set firstRun to false even without window", () => {
      expect(firstRun).toBe(true);

      extendedService.hydratedEffect(mockEffectFn, getFirstRun, setFirstRun);

      expect(firstRun).toBe(false);
    });
  });
});
