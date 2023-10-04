use realfft::{num_complex::Complex, RealFftPlanner};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct FftEntry {
    pub idx: i32,
    pub re: f64,
    pub im: f64,
}

impl AsRef<JsValue> for FftEntry {
    fn as_ref(&self) -> &JsValue {
        unreachable!()
    }
}
impl JsCast for FftEntry
where
    Self: AsRef<JsValue>,
{
    fn instanceof(_val: &JsValue) -> bool {
        unreachable!()
    }

    fn unchecked_from_js(val: JsValue) -> Self {
        Self {
            idx: js_sys::Reflect::get(&val, &JsValue::from_str("idx"))
                .unwrap()
                .as_f64()
                .unwrap() as i32,
            re: js_sys::Reflect::get(&val, &JsValue::from_str("re"))
                .unwrap()
                .as_f64()
                .unwrap(),
            im: js_sys::Reflect::get(&val, &JsValue::from_str("im"))
                .unwrap()
                .as_f64()
                .unwrap(),
        }
    }

    fn unchecked_from_js_ref(_val: &JsValue) -> &Self {
        unreachable!()
    }
}

#[wasm_bindgen]
pub fn rifft(coefficients: Vec<JsValue>, len: usize) -> Vec<f64> {
    let coefficients: Vec<FftEntry> = coefficients
        .into_iter()
        .map(|v| v.unchecked_into())
        .collect();

    let mut planner = RealFftPlanner::<f64>::new();
    let c2r = planner.plan_fft_inverse(len);

    let mut spectrum = c2r.make_input_vec();
    for e in coefficients {
        spectrum[e.idx as usize] = Complex { re: e.re, im: e.im };
    }

    let mut values = c2r.make_output_vec();
    c2r.process(&mut spectrum, &mut values).unwrap();

    let len = len as f64;
    values.into_iter().map(|v| v / len).collect()
}
