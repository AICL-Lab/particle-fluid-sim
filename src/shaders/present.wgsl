struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@group(0) @binding(0) var sceneSampler: sampler;
@group(0) @binding(1) var sceneTexture: texture_2d<f32>;

const QUAD_POSITIONS = array<vec2f, 4>(
  vec2f(-1.0, -1.0),
  vec2f(1.0, -1.0),
  vec2f(-1.0, 1.0),
  vec2f(1.0, 1.0),
);

const QUAD_UVS = array<vec2f, 4>(
  vec2f(0.0, 1.0),
  vec2f(1.0, 1.0),
  vec2f(0.0, 0.0),
  vec2f(1.0, 0.0),
);

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var output: VertexOutput;
  output.position = vec4f(QUAD_POSITIONS[vertexIndex], 0.0, 1.0);
  output.uv = QUAD_UVS[vertexIndex];
  return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  return textureSample(sceneTexture, sceneSampler, input.uv);
}
